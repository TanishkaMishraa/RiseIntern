import logging
from collections import deque
from dataclasses import dataclass

from app.core.email import send_email

logger = logging.getLogger(__name__)

_queue: deque["QueuedEmail"] = deque()


@dataclass
class QueuedEmail:
    to: str
    subject: str
    body: str


def enqueue_email(to: str, subject: str, body: str) -> None:
    _queue.append(QueuedEmail(to=to, subject=subject, body=body))


def process_email_queue() -> None:
    sent = 0
    while _queue:
        item = _queue.popleft()
        try:
            send_email(item.to, item.subject, item.body)
            sent += 1
        except Exception:
            logger.exception("Failed to send queued email to %s", item.to)
    if sent:
        logger.info("Sent %d queued email(s)", sent)
