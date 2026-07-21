from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.name is not None:
        current_user.name = payload.name
    if payload.skills is not None:
        current_user.skills = payload.skills
    if payload.education is not None:
        current_user.education = payload.education
    if payload.location is not None:
        current_user.location = payload.location

    db.commit()
    db.refresh(current_user)
    return current_user
