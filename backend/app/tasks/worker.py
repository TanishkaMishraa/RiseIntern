import logging

from apscheduler.schedulers.background import BackgroundScheduler

from app.tasks.deadlines import close_expired_internships
from app.tasks.emails import process_email_queue

logger = logging.getLogger(__name__)

_scheduler = BackgroundScheduler()


def start_scheduler() -> None:
    if _scheduler.running:
        return

    _scheduler.add_job(close_expired_internships, "interval", minutes=30, id="close_expired_internships")
    _scheduler.add_job(process_email_queue, "interval", minutes=1, id="process_email_queue")
    _scheduler.start()
    logger.info("Background scheduler started")


def stop_scheduler() -> None:
    if _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("Background scheduler stopped")
