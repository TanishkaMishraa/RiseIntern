from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    cover_note: str | None = None


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    internship_id: int
    student_id: int
    created_at: datetime
    updated_at: datetime


class MyApplicationRead(BaseModel):
    id: int
    status: str
    internshipTitle: str
    createdAt: datetime


class StudentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    skills: list[str] = []
    education: str | None = None
    location: str | None = None


class ApplicantOut(BaseModel):
    id: int
    status: str
    cover_note: str | None = None
    student: StudentSummary
