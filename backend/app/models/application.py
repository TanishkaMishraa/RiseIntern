from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin

STATUSES = ("applied", "shortlisted", "interview", "offered", "rejected")


class Application(Base, TimestampMixin):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column(String(20), default="applied")
    cover_note: Mapped[str | None] = mapped_column(Text, default=None)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    internship_id: Mapped[int] = mapped_column(ForeignKey("internships.id"))
    internship: Mapped["Internship"] = relationship(back_populates="applications")

    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    student: Mapped["User"] = relationship(back_populates="applications")
