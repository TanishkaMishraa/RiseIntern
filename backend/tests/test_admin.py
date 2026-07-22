from datetime import datetime, timedelta, timezone

from app.models.internship import Internship
from tests.conftest import auth_headers, make_user


def _create_internship(db_session, recruiter_id, *, title="Backend Intern"):
    internship = Internship(
        title=title,
        domain="Software Development",
        description="x",
        deadline=datetime.now(timezone.utc) + timedelta(days=10),
        recruiter_id=recruiter_id,
    )
    db_session.add(internship)
    db_session.commit()
    db_session.refresh(internship)
    return internship


ADMIN_ENDPOINTS = [
    ("get", "/api/admin/users"),
    ("get", "/api/admin/internships"),
    ("post", "/api/admin/users/999/deactivate"),
    ("post", "/api/admin/users/999/reactivate"),
    ("delete", "/api/admin/internships/999"),
]


def test_non_admin_gets_403_on_every_admin_endpoint(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")

    for email in ("aarav@example.com", "priya@example.com"):
        headers = auth_headers(client, email)
        for method, path in ADMIN_ENDPOINTS:
            response = getattr(client, method)(path, headers=headers)
            assert response.status_code == 403, f"{method.upper()} {path} as {email} was {response.status_code}"


def test_admin_can_list_users_paginated(client, db_session):
    admin = make_user(db_session, name="Admin", email="admin@example.com", role="admin")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "admin@example.com")

    response = client.get("/api/admin/users?page=1&pageSize=1", headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    assert body["page"] == 1
    assert body["pages"] == 2
    assert len(body["items"]) == 1


def test_admin_can_list_all_internships_paginated(client, db_session):
    make_user(db_session, name="Admin", email="admin@example.com", role="admin")
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    _create_internship(db_session, recruiter.id, title="Listing A")
    _create_internship(db_session, recruiter.id, title="Listing B")
    headers = auth_headers(client, "admin@example.com")

    response = client.get("/api/admin/internships", headers=headers)
    assert response.status_code == 200
    assert response.json()["total"] == 2


def test_deactivate_and_reactivate_user(client, db_session):
    make_user(db_session, name="Admin", email="admin@example.com", role="admin")
    student = make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    admin_headers = auth_headers(client, "admin@example.com")

    deactivate = client.post(f"/api/admin/users/{student.id}/deactivate", headers=admin_headers)
    assert deactivate.status_code == 200
    assert deactivate.json()["is_active"] is False

    login_attempt = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "password123"}
    )
    assert login_attempt.status_code == 403

    reactivate = client.post(f"/api/admin/users/{student.id}/reactivate", headers=admin_headers)
    assert reactivate.status_code == 200
    assert reactivate.json()["is_active"] is True

    login_again = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "password123"}
    )
    assert login_again.status_code == 200


def test_takedown_soft_deletes_and_hides_from_public_browse(client, db_session):
    make_user(db_session, name="Admin", email="admin@example.com", role="admin")
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    internship = _create_internship(db_session, recruiter.id, title="Spammy Listing")
    admin_headers = auth_headers(client, "admin@example.com")

    public_before = client.get("/api/internships")
    assert any(i["title"] == "Spammy Listing" for i in public_before.json())

    takedown = client.delete(f"/api/admin/internships/{internship.id}", headers=admin_headers)
    assert takedown.status_code == 200
    assert takedown.json()["is_removed"] is True

    public_after = client.get("/api/internships")
    assert not any(i["title"] == "Spammy Listing" for i in public_after.json())

    # still visible to the admin's own management view
    admin_list = client.get("/api/admin/internships", headers=admin_headers)
    assert any(i["title"] == "Spammy Listing" for i in admin_list.json()["items"])
