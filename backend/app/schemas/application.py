from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    pass


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


class ApplicantSummary(BaseModel):
    id: int
    name: str
    internshipTitle: str
    status: str
