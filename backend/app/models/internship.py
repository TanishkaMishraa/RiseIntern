from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Internship(Base, TimestampMixin):
    __tablename__ = "internships"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(160))
    domain: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    skills_required: Mapped[list[str]] = mapped_column(JSON, default=list)
    stipend: Mapped[int] = mapped_column(Integer, default=0)
    location: Mapped[str] = mapped_column(String(120), default="Remote")
    deadline: Mapped[datetime] = mapped_column(DateTime)
    is_closed: Mapped[bool] = mapped_column(default=False)

    recruiter_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    recruiter: Mapped["User"] = relationship(back_populates="internships")

    applications: Mapped[list["Application"]] = relationship(
        back_populates="internship", cascade="all, delete-orphan"
    )
    bookmarks: Mapped[list["Bookmark"]] = relationship(
        back_populates="internship", cascade="all, delete-orphan"
    )
