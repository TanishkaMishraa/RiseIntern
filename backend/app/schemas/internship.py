from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InternshipBase(BaseModel):
    title: str
    domain: str
    description: str
    skills_required: list[str] = []
    stipend: int = 0
    location: str = "Remote"
    deadline: datetime


class InternshipCreate(InternshipBase):
    pass


class InternshipUpdate(BaseModel):
    title: str | None = None
    domain: str | None = None
    description: str | None = None
    skills_required: list[str] | None = None
    stipend: int | None = None
    location: str | None = None
    deadline: datetime | None = None
    is_closed: bool | None = None


class InternshipRead(InternshipBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    recruiter_id: int
    is_closed: bool
    created_at: datetime
    bookmarked: bool = False


class RecommendationRead(BaseModel):
    internship: InternshipRead
    matchScore: int
    reasons: list[str]
