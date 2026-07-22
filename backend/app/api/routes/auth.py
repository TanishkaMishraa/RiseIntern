from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    decode_email_verification_token,
    decode_password_reset_token,
    hash_password,
    peek_password_reset_email,
    verify_password,
)
from app.models.user import User
from app.schemas.common import Message
from app.schemas.token import ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, TokenResponse
from app.schemas.user import UserCreate, UserRead
from app.services.email_service import send_password_reset_email, send_verification_email

settings = get_settings()

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

    verify_token = create_email_verification_token(user.email)
    send_verification_email(
        user.email, user.name, verify_url=f"{settings.frontend_url}/verify-email?token={verify_token}"
    )
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated")

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
    email = decode_email_verification_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_verified = True
    db.commit()
    return Message(detail="Email verified")


@router.post("/forgot-password", response_model=Message)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Always return the same response whether or not the email is
    # registered, so this endpoint can't be used to enumerate accounts.
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        reset_token = create_password_reset_token(user.email, user.hashed_password)
        send_password_reset_email(
            user.email, user.name, reset_url=f"{settings.frontend_url}/reset-password?token={reset_token}"
        )
    return Message(detail="If that email exists, a reset link has been sent")


@router.post("/reset-password", response_model=Message)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    # The fingerprint check needs the user's *current* hash, so we look the
    # user up by the token's claimed email first, then verify the token
    # against that specific user's hash before trusting anything in it.
    email = peek_password_reset_email(payload.token)
    user = db.query(User).filter(User.email == email).first() if email else None
    if not user or not decode_password_reset_token(payload.token, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return Message(detail="Password updated")
