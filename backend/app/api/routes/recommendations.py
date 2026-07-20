from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.internship import Internship
from app.models.user import User
from app.schemas.internship import InternshipRead, RecommendationRead
from app.services.matching import rank_internships

router = APIRouter(prefix="/internships", tags=["recommendations"])


@router.get("/recommendations", response_model=list[RecommendationRead])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    open_internships = db.query(Internship).filter(Internship.is_closed.is_(False)).all()
    ranked = rank_internships(current_user, open_internships)

    return [
        RecommendationRead(
            internship=InternshipRead.model_validate(internship),
            matchScore=score,
            reasons=reasons,
        )
        for internship, score, reasons in ranked
    ]
