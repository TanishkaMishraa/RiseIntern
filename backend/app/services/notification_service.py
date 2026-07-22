from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    user_id: int,
    message: str,
    type: str = "general",
    link: str | None = None,
) -> Notification:
    notification = Notification(user_id=user_id, message=message, type=type, link=link)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
