from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin

ROLES = ("student", "recruiter", "admin")


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="student")
    skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    education: Mapped[str | None] = mapped_column(String(200), default=None)
    location: Mapped[str | None] = mapped_column(String(120), default=None)
    is_active: Mapped[bool] = mapped_column(default=True)
    is_verified: Mapped[bool] = mapped_column(default=False)

    internships: Mapped[list["Internship"]] = relationship(back_populates="recruiter")
    applications: Mapped[list["Application"]] = relationship(back_populates="student")
    bookmarks: Mapped[list["Bookmark"]] = relationship(back_populates="student")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user")
    resume: Mapped["Resume"] = relationship(back_populates="student", uselist=False)
