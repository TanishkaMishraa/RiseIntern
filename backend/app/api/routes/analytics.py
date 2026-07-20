from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.core.database import get_db
from app.models.user import User
from app.schemas.analytics import AdminAnalytics, RecruiterAnalytics
from app.services.analytics_service import admin_analytics, recruiter_analytics

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/recruiter", response_model=RecruiterAnalytics)
def get_recruiter_analytics(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    return recruiter_analytics(db, current_user.id)


@router.get("/admin", response_model=AdminAnalytics)
def get_admin_analytics(
    _: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return admin_analytics(db)
