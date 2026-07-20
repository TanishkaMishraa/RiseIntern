from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Bookmark(Base, TimestampMixin):
    __tablename__ = "bookmarks"
    __table_args__ = (UniqueConstraint("student_id", "internship_id", name="uq_student_internship"),)

    id: Mapped[int] = mapped_column(primary_key=True)

    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    student: Mapped["User"] = relationship(back_populates="bookmarks")

    internship_id: Mapped[int] = mapped_column(ForeignKey("internships.id"))
    internship: Mapped["Internship"] = relationship(back_populates="bookmarks")
