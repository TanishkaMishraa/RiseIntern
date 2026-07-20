from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.core.database import get_db
from app.core.storage import delete_file, save_file
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeRead
from app.services.resume_parser import extract_skills, extract_text

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("", response_model=ResumeRead, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    resume: UploadFile,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    contents = await resume.read()

    text = extract_text(contents, resume.filename or "resume.txt")
    skills = extract_skills(text)
    stored_path = save_file(resume.filename or "resume.txt", contents)

    existing = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if existing:
        delete_file(existing.file_path)
        existing.filename = resume.filename or "resume.txt"
        existing.file_path = stored_path
        existing.extracted_skills = skills
        record = existing
    else:
        record = Resume(
            student_id=current_user.id,
            filename=resume.filename or "resume.txt",
            file_path=stored_path,
            extracted_skills=skills,
        )
        db.add(record)

    merged_skills = sorted(set(current_user.skills or []) | set(skills))
    current_user.skills = merged_skills

    db.commit()
    db.refresh(record)
    return record


@router.get("/me", response_model=ResumeRead)
def get_my_resume(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    record = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No resume uploaded")
    return record


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_resume(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    record = db.query(Resume).filter(Resume.student_id == current_user.id).first()
    if record:
        delete_file(record.file_path)
        db.delete(record)
        db.commit()
