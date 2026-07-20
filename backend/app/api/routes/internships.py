from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_user, require_role
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.models.internship import Internship
from app.models.user import User
from app.schemas.import_csv import CsvImportResult
from app.schemas.internship import InternshipCreate, InternshipRead, InternshipUpdate
from app.services.csv_import import import_internships_csv

router = APIRouter(prefix="/internships", tags=["internships"])


def _to_read_model(internship: Internship, bookmarked_ids: set[int]) -> InternshipRead:
    data = InternshipRead.model_validate(internship)
    data.bookmarked = internship.id in bookmarked_ids
    return data


@router.get("", response_model=list[InternshipRead])
def list_internships(
    search: str | None = None,
    domain: str | None = None,
    location: str | None = None,
    minStipend: int | None = None,
    recruiterId: int | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    query = db.query(Internship)

    if domain:
        query = query.filter(Internship.domain == domain)
    if location:
        query = query.filter(Internship.location.ilike(f"%{location}%"))
    if minStipend:
        query = query.filter(Internship.stipend >= minStipend)
    if recruiterId:
        query = query.filter(Internship.recruiter_id == recruiterId)
    if search:
        like = f"%{search}%"
        query = query.filter(
            Internship.title.ilike(like) | Internship.domain.ilike(like) | Internship.description.ilike(like)
        )

    internships = query.order_by(Internship.created_at.desc()).all()

    bookmarked_ids: set[int] = set()
    if current_user:
        bookmarked_ids = {
            b.internship_id for b in db.query(Bookmark).filter(Bookmark.student_id == current_user.id)
        }

    return [_to_read_model(i, bookmarked_ids) for i in internships]


@router.get("/{internship_id}", response_model=InternshipRead)
def get_internship(
    internship_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")

    bookmarked_ids: set[int] = set()
    if current_user:
        bookmarked_ids = {
            b.internship_id for b in db.query(Bookmark).filter(Bookmark.student_id == current_user.id)
        }
    return _to_read_model(internship, bookmarked_ids)


@router.post("", response_model=InternshipRead, status_code=status.HTTP_201_CREATED)
def create_internship(
    payload: InternshipCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    internship = Internship(**payload.model_dump(), recruiter_id=current_user.id)
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return _to_read_model(internship, set())


@router.put("/{internship_id}", response_model=InternshipRead)
def update_internship(
    internship_id: int,
    payload: InternshipUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    internship = db.get(Internship, internship_id)
    if not internship or internship.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)
    return _to_read_model(internship, set())


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(
    internship_id: int,
    current_user: User = Depends(require_role("recruiter", "admin")),
    db: Session = Depends(get_db),
):
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
    if current_user.role == "recruiter" and internship.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your listing")

    db.delete(internship)
    db.commit()


@router.post("/import-csv", response_model=CsvImportResult)
async def import_csv(
    file: UploadFile,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    contents = await file.read()
    result = import_internships_csv(db, current_user.id, contents)
    return result
