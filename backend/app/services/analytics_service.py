from collections import Counter
from datetime import timedelta
from datetime import datetime as dt

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.application import STATUSES, Application
from app.models.internship import Internship
from app.models.user import User


def recruiter_analytics(db: Session, recruiter_id: int) -> dict:
    rows = (
        db.query(Internship.title, func.count(Application.id))
        .outerjoin(Application, Application.internship_id == Internship.id)
        .filter(Internship.recruiter_id == recruiter_id)
        .group_by(Internship.id)
        .all()
    )

    status_rows = (
        db.query(Application.status, func.count(Application.id))
        .join(Internship, Application.internship_id == Internship.id)
        .filter(Internship.recruiter_id == recruiter_id)
        .group_by(Application.status)
        .all()
    )
    counts_by_status = dict(status_rows)
    funnel = [{"status": status, "count": counts_by_status.get(status, 0)} for status in STATUSES]

    applicant_skills = (
        db.query(User.skills)
        .join(Application, Application.student_id == User.id)
        .join(Internship, Application.internship_id == Internship.id)
        .filter(Internship.recruiter_id == recruiter_id)
        .all()
    )
    skill_counts = Counter(skill for (skills,) in applicant_skills for skill in (skills or []))
    popular_skills = [
        {"skill": skill, "count": count} for skill, count in skill_counts.most_common(10)
    ]

    return {
        "applicationsPerListing": [
            {"title": title, "applications": count} for title, count in rows
        ],
        "funnel": funnel,
        "popularSkills": popular_skills,
    }


def admin_analytics(db: Session) -> dict:
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_listings = db.query(func.count(Internship.id)).scalar() or 0
    total_applications = db.query(func.count(Application.id)).scalar() or 0

    since = dt.utcnow() - timedelta(days=14)
    rows = (
        db.query(func.date(User.created_at), func.count(User.id))
        .filter(User.created_at >= since)
        .group_by(func.date(User.created_at))
        .order_by(func.date(User.created_at))
        .all()
    )

    return {
        "totalUsers": total_users,
        "totalListings": total_listings,
        "totalApplications": total_applications,
        "signupsOverTime": [{"date": str(date), "count": count} for date, count in rows],
    }
