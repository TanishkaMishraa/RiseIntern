import math

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import PaginationParams, require_role
from app.core.database import get_db
from app.models.internship import Internship
from app.models.user import User
from app.schemas.common import Page
from app.schemas.internship import AdminInternshipRead, InternshipRead
from app.schemas.user import UserRead

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=Page[UserRead])
def list_users(
    pagination: PaginationParams = Depends(),
    _: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    query = db.query(User).order_by(User.created_at.desc())
    total = query.count()
    items = query.offset(pagination.offset).limit(pagination.page_size).all()
    return Page(
        items=items,
        total=total,
        page=pagination.page,
        pages=max(1, math.ceil(total / pagination.page_size)),
    )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user(
    user_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot remove yourself")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()


@router.post("/users/{user_id}/deactivate", response_model=UserRead)
def deactivate_user(
    user_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate yourself")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


@router.post("/users/{user_id}/reactivate", response_model=UserRead)
def reactivate_user(
    user_id: int,
    _: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = True
    db.commit()
    db.refresh(user)
    return user


@router.get("/internships", response_model=Page[AdminInternshipRead])
def list_all_internships(
    pagination: PaginationParams = Depends(),
    _: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    query = db.query(Internship).order_by(Internship.created_at.desc())
    total = query.count()
    listings = query.offset(pagination.offset).limit(pagination.page_size).all()
    items = [
        AdminInternshipRead(**InternshipRead.model_validate(i).model_dump(), recruiterName=i.recruiter.name)
        for i in listings
    ]
    return Page(
        items=items,
        total=total,
        page=pagination.page,
        pages=max(1, math.ceil(total / pagination.page_size)),
    )


@router.delete("/internships/{internship_id}", response_model=InternshipRead)
def takedown_internship(
    internship_id: int,
    _: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")

    internship.is_removed = True
    db.commit()
    db.refresh(internship)
    return internship
