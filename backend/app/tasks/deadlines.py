import logging
from datetime import datetime, timezone

from app.core.database import SessionLocal
from app.models.internship import Internship

logger = logging.getLogger(__name__)


def close_expired_internships() -> None:
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        expired = (
            db.query(Internship)
            .filter(Internship.deadline < now, Internship.is_closed.is_(False))
            .all()
        )
        for internship in expired:
            internship.is_closed = True
        if expired:
            db.commit()
            logger.info("Closed %d expired internship(s)", len(expired))
    finally:
        db.close()
