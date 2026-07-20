from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Resume(Base, TimestampMixin):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(500))
    extracted_skills: Mapped[list[str]] = mapped_column(JSON, default=list)

    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    student: Mapped["User"] = relationship(back_populates="resume")
