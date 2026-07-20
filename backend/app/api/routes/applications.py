from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.core.database import get_db
from app.models.application import Application
from app.models.internship import Internship
from app.models.user import User
from app.schemas.application import ApplicantSummary, ApplicationStatusUpdate, MyApplicationRead
from app.services.email_service import send_application_status_email
from app.services.notification_service import create_notification

router = APIRouter(tags=["applications"])


@router.post(
    "/internships/{internship_id}/applications",
    response_model=MyApplicationRead,
    status_code=status.HTTP_201_CREATED,
)
def apply_to_internship(
    internship_id: int,
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")

    existing = (
        db.query(Application)
        .filter(Application.internship_id == internship_id, Application.student_id == current_user.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already applied")

    application = Application(internship_id=internship_id, student_id=current_user.id)
    db.add(application)
    db.commit()
    db.refresh(application)

    return MyApplicationRead(
        id=application.id,
        status=application.status,
        internshipTitle=internship.title,
        createdAt=application.created_at,
    )


@router.get("/applications/me", response_model=list[MyApplicationRead])
def list_my_applications(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    applications = (
        db.query(Application).filter(Application.student_id == current_user.id).all()
    )
    return [
        MyApplicationRead(
            id=a.id,
            status=a.status,
            internshipTitle=a.internship.title,
            createdAt=a.created_at,
        )
        for a in applications
    ]


@router.get("/internships/{internship_id}/applications", response_model=list[ApplicantSummary])
def list_applicants(
    internship_id: int,
    current_user: User = Depends(require_role("recruiter", "admin")),
    db: Session = Depends(get_db),
):
    internship = db.get(Internship, internship_id)
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
    if current_user.role == "recruiter" and internship.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your listing")

    applications = db.query(Application).filter(Application.internship_id == internship_id).all()
    return [
        ApplicantSummary(
            id=a.id,
            name=a.student.name,
            internshipTitle=internship.title,
            status=a.status,
        )
        for a in applications
    ]


@router.patch("/applications/{application_id}", response_model=ApplicantSummary)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    current_user: User = Depends(require_role("recruiter", "admin")),
    db: Session = Depends(get_db),
):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if current_user.role == "recruiter" and application.internship.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your listing")

    application.status = payload.status
    db.commit()
    db.refresh(application)

    create_notification(
        db,
        user_id=application.student_id,
        message=f"Your application for '{application.internship.title}' is now {payload.status}.",
    )
    send_application_status_email(
        application.student.email, application.student.name, application.internship.title, payload.status
    )

    return ApplicantSummary(
        id=application.id,
        name=application.student.name,
        internshipTitle=application.internship.title,
        status=application.status,
    )
