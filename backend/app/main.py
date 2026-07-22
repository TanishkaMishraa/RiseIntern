import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.routes import (
    admin,
    analytics,
    applications,
    auth,
    bookmarks,
    chat,
    internships,
    notifications,
    recommendations,
    resumes,
    users,
)
from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine
from app.core.logging_config import configure_logging
from app.tasks.worker import start_scheduler, stop_scheduler

settings = get_settings()
logger = logging.getLogger(__name__)

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.environment, traces_sample_rate=0.1)


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging()
    if settings.environment != "production":
        # Dev/test convenience only. Production schema is owned entirely by
        # Alembic (`alembic upgrade head`, run before the app starts — see
        # docker-compose.yml) so a populated database can be evolved without
        # ever being dropped.
        Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router_prefix = "/api"

# recommendations must be registered before internships: both define
# routes under "/internships" and "/internships/recommendations" would
# otherwise be shadowed by "/internships/{internship_id}".
app.include_router(recommendations.router, prefix=api_router_prefix)
app.include_router(auth.router, prefix=api_router_prefix)
app.include_router(users.router, prefix=api_router_prefix)
app.include_router(internships.router, prefix=api_router_prefix)
app.include_router(applications.router, prefix=api_router_prefix)
app.include_router(admin.router, prefix=api_router_prefix)
app.include_router(bookmarks.router, prefix=api_router_prefix)
app.include_router(notifications.router, prefix=api_router_prefix)
app.include_router(analytics.router, prefix=api_router_prefix)
app.include_router(resumes.router, prefix=api_router_prefix)
app.include_router(chat.router, prefix=api_router_prefix)


@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        try:
            db.execute(text("SELECT 1"))
        finally:
            db.close()
    except Exception:
        logger.exception("Health check failed: database unreachable")
        return JSONResponse(status_code=503, content={"status": "error", "database": "unreachable"})

    return {"status": "ok", "database": "ok"}
