from datetime import datetime, timedelta, timezone

from app.models.internship import Internship
from tests.conftest import auth_headers, make_user


def _create_internship(db_session, recruiter_id):
    internship = Internship(
        title="Backend Intern",
        domain="Software Development",
        description="x",
        deadline=datetime.now(timezone.utc) + timedelta(days=10),
        recruiter_id=recruiter_id,
    )
    db_session.add(internship)
    db_session.commit()
    db_session.refresh(internship)
    return internship


def test_bookmark_add_list_remove(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    internship = _create_internship(db_session, recruiter.id)

    headers = auth_headers(client, "aarav@example.com")

    add_response = client.post("/api/bookmarks", json={"internshipId": internship.id}, headers=headers)
    assert add_response.status_code == 201

    list_response = client.get("/api/bookmarks", headers=headers)
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["bookmarked"] is True

    remove_response = client.delete(f"/api/bookmarks/{internship.id}", headers=headers)
    assert remove_response.status_code == 204

    list_after = client.get("/api/bookmarks", headers=headers)
    assert list_after.json() == []


def test_bookmark_duplicate_returns_400(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    internship = _create_internship(db_session, recruiter.id)
    headers = auth_headers(client, "aarav@example.com")

    first = client.post("/api/bookmarks", json={"internshipId": internship.id}, headers=headers)
    assert first.status_code == 201

    duplicate = client.post("/api/bookmarks", json={"internshipId": internship.id}, headers=headers)
    assert duplicate.status_code == 400


def test_bookmark_requires_student_role(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    internship = _create_internship(db_session, recruiter.id)
    headers = auth_headers(client, "priya@example.com")

    response = client.post("/api/bookmarks", json={"internshipId": internship.id}, headers=headers)
    assert response.status_code == 403
