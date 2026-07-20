from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.models.internship import Internship
from app.models.user import User
from app.schemas.bookmark import BookmarkCreate
from app.schemas.internship import InternshipRead

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("", response_model=list[InternshipRead])
def list_bookmarks(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    bookmarks = db.query(Bookmark).filter(Bookmark.student_id == current_user.id).all()
    return [
        InternshipRead.model_validate(b.internship).model_copy(update={"bookmarked": True})
        for b in bookmarks
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
def add_bookmark(
    payload: BookmarkCreate,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    internship = db.get(Internship, payload.internshipId)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")

    existing = (
        db.query(Bookmark)
        .filter(Bookmark.student_id == current_user.id, Bookmark.internship_id == payload.internshipId)
        .first()
    )
    if existing:
        return {"detail": "Already bookmarked"}

    db.add(Bookmark(student_id=current_user.id, internship_id=payload.internshipId))
    db.commit()
    return {"detail": "Bookmarked"}


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_bookmark(
    internship_id: int,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    bookmark = (
        db.query(Bookmark)
        .filter(Bookmark.student_id == current_user.id, Bookmark.internship_id == internship_id)
        .first()
    )
    if bookmark:
        db.delete(bookmark)
        db.commit()
