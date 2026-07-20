from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    admin,
    analytics,
    applications,
    auth,
    bookmarks,
    internships,
    notifications,
    recommendations,
    resumes,
    users,
)
from app.core.config import get_settings
from app.core.database import Base, engine
from app.core.logging_config import configure_logging
from app.tasks.worker import start_scheduler, stop_scheduler

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging()
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


@app.get("/health")
def health_check():
    return {"status": "ok"}
