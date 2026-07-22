import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import hash_password
from app.main import app
from app.models.user import User
from app.tasks import emails as email_tasks

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def _reset_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def _reset_email_queue():
    # The email queue is process-global (a module-level deque), so it leaks
    # across tests unless cleared on both sides of each test.
    email_tasks._queue.clear()
    yield
    email_tasks._queue.clear()


@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def make_user(db_session, *, name, email, role, skills=None, password="password123"):
    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        role=role,
        skills=skills or [],
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def auth_headers(client, email, password="password123"):
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    token = response.json()["token"]
    return {"Authorization": f"Bearer {token}"}
