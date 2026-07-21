from datetime import datetime, timedelta, timezone

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.application import Application
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

NOW = datetime.now(timezone.utc)


def dl(days: int) -> datetime:
    return NOW + timedelta(days=days)


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded, skipping.")
            return

        recruiter1 = User(
            name="Priya Sharma",
            email="recruiter@riseintern.com",
            hashed_password=hash_password("password123"),
            role="recruiter",
        )
        recruiter2 = User(
            name="Karan Verma",
            email="recruiter2@riseintern.com",
            hashed_password=hash_password("password123"),
            role="recruiter",
        )
        student = User(
            name="Aarav Mehta",
            email="student@riseintern.com",
            hashed_password=hash_password("password123"),
            role="student",
            skills=["JavaScript", "React", "Communication"],
            education="B.Tech Computer Science, Class of 2026",
            location="Bengaluru",
        )
        admin = User(
            name="Site Admin",
            email="admin@riseintern.com",
            hashed_password=hash_password("password123"),
            role="admin",
        )
        db.add_all([recruiter1, recruiter2, student, admin])
        db.flush()

        recruiters = [recruiter1, recruiter2]
        internships = []
        for i, (title, domain, skills, stipend, location) in enumerate(LISTINGS):
            internship = Internship(
                title=title,
                domain=domain,
                description=f"Join our team as a {title.lower()} and work on real-world projects.",
                skills_required=skills,
                stipend=stipend,
                location=location,
                deadline=dl(14 + i),
                recruiter_id=recruiters[i % len(recruiters)].id,
            )
            db.add(internship)
            internships.append(internship)
        db.flush()

        recruiter1_listings = [i for i in internships if i.recruiter_id == recruiter1.id]
        demo_applications = [
            (recruiter1_listings[0], "applied", "I've shipped two React side projects and would love to bring that to a real team."),
            (recruiter1_listings[1], "shortlisted", "Comfortable with Python and SQL from coursework and a summer project."),
            (recruiter1_listings[2], "interview", "Built a full-stack app end to end — excited about this role."),
        ]
        for internship, application_status, cover_note in demo_applications:
            db.add(
                Application(
                    internship_id=internship.id,
                    student_id=student.id,
                    status=application_status,
                    cover_note=cover_note,
                )
            )

        db.commit()
        print(
            f"Seeded {len(LISTINGS)} internships across 2 recruiters, "
            f"{len(demo_applications)} demo applications, and 4 demo users (password123)."
        )
    finally:
        db.close()


if __name__ == "__main__":
    seed()
