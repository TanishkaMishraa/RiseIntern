from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.common import Message
from app.schemas.token import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserRead
from app.services.email_service import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(user.email, user.name, verify_url="https://riseintern.example/verify")
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=user.email)
    return TokenResponse(token=token, user=user)


@router.post("/logout")
def logout(_: User = Depends(get_current_user)):
    return {"detail": "Logged out"}


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/verify-email", response_model=Message)
def verify_email(token: str, db: Session = Depends(get_db)):
    email = decode_access_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return Message(detail="Email verified")


@router.post("/forgot-password", response_model=Message)
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email", "")
    user = db.query(User).filter(User.email == email).first()
    if user:
        reset_token = create_access_token(subject=user.email, expires_minutes=30)
        send_verification_email(
            user.email, user.name, verify_url=f"https://riseintern.example/reset?token={reset_token}"
        )
    return Message(detail="If that email exists, a reset link has been sent")


@router.post("/reset-password", response_model=Message)
def reset_password(payload: dict, db: Session = Depends(get_db)):
    email = decode_access_token(payload.get("token", ""))
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.hashed_password = hash_password(payload.get("newPassword", ""))
    db.commit()
    return Message(detail="Password updated")
