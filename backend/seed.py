from datetime import datetime, timedelta, timezone

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.internship import Internship
from app.models.user import User

LISTINGS = [
    ("Frontend Engineering Intern", "Software Development", ["JavaScript", "React", "CSS"], 15000, "Bengaluru"),
    ("Backend Engineering Intern", "Software Development", ["Python", "SQL", "Git"], 15000, "Remote"),
    ("Full-Stack Developer Intern", "Software Development", ["JavaScript", "React", "Node.js"], 18000, "Pune"),
    ("Data Analyst Intern", "Data Science", ["SQL", "Excel", "Data Analysis"], 12000, "Hyderabad"),
    ("Machine Learning Intern", "Data Science", ["Python", "Machine Learning"], 20000, "Remote"),
    ("Business Intelligence Intern", "Data Science", ["SQL", "Excel"], 13000, "Mumbai"),
    ("UI/UX Design Intern", "Design", ["Figma", "Communication"], 10000, "Remote"),
    ("Graphic Design Intern", "Design", ["Figma"], 8000, "Delhi"),
    ("Product Design Intern", "Design", ["Figma", "Communication"], 14000, "Bengaluru"),
    ("Digital Marketing Intern", "Marketing", ["SEO", "Communication"], 9000, "Remote"),
    ("Social Media Marketing Intern", "Marketing", ["SEO", "Communication"], 8000, "Delhi"),
    ("Growth Marketing Intern", "Marketing", ["SEO", "Data Analysis"], 11000, "Remote"),
    ("Investment Banking Intern", "Finance", ["Excel", "Data Analysis"], 16000, "Mumbai"),
    ("Financial Analyst Intern", "Finance", ["Excel", "Communication"], 14000, "Gurugram"),
    ("HR Operations Intern", "Human Resources", ["Communication", "Project Management"], 9000, "Remote"),
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded, skipping.")
            return

        recruiter = User(
            name="Priya Sharma",
            email="recruiter@riseintern.com",
            hashed_password=hash_password("password123"),
            role="recruiter",
        )
        student = User(
            name="Aarav Mehta",
            email="student@riseintern.com",
            hashed_password=hash_password("password123"),
            role="student",
            skills=["JavaScript", "React", "Communication"],
        )
        admin = User(
            name="Site Admin",
            email="admin@riseintern.com",
            hashed_password=hash_password("password123"),
            role="admin",
        )
        db.add_all([recruiter, student, admin])
        db.flush()

        now = datetime.now(timezone.utc)
        for i, (title, domain, skills, stipend, location) in enumerate(LISTINGS):
            db.add(
                Internship(
                    title=title,
                    domain=domain,
                    description=f"Join our team as a {title.lower()} and work on real-world projects.",
                    skills_required=skills,
                    stipend=stipend,
                    location=location,
                    deadline=now + timedelta(days=14 + i),
                    recruiter_id=recruiter.id,
                )
            )

        db.commit()
        print(f"Seeded {len(LISTINGS)} internships and 3 demo users (password123).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
