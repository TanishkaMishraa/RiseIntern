from datetime import datetime, timedelta, timezone

from app.models.internship import Internship
from tests.conftest import auth_headers, make_user


def _create_internship(db_session, recruiter_id, *, title="Backend Intern", is_closed=False):
    internship = Internship(
        title=title,
        domain="Software Development",
        description="x",
        skills_required=["Python"],
        deadline=datetime.now(timezone.utc) + timedelta(days=10),
        recruiter_id=recruiter_id,
        is_closed=is_closed,
    )
    db_session.add(internship)
    db_session.commit()
    db_session.refresh(internship)
    return internship


def test_mine_returns_only_own_listings_including_closed(client, db_session):
    owner = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    other = make_user(db_session, name="Karan", email="karan@example.com", role="recruiter")

    _create_internship(db_session, owner.id, title="Owner Open Listing")
    _create_internship(db_session, owner.id, title="Owner Closed Listing", is_closed=True)
    _create_internship(db_session, other.id, title="Other Recruiter Listing")

    headers = auth_headers(client, "priya@example.com")
    response = client.get("/api/internships/mine", headers=headers)

    assert response.status_code == 200
    titles = {listing["title"] for listing in response.json()}
    assert titles == {"Owner Open Listing", "Owner Closed Listing"}


def test_mine_requires_recruiter_role(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    response = client.get("/api/internships/mine", headers=headers)
    assert response.status_code == 403


def test_applicants_response_includes_student_name_and_skills(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    make_user(
        db_session,
        name="Aarav",
        email="aarav@example.com",
        role="student",
        skills=["Python", "SQL"],
    )
    internship = _create_internship(db_session, recruiter.id)

    student_headers = auth_headers(client, "aarav@example.com")
    client.post(
        f"/api/internships/{internship.id}/applications",
        json={"cover_note": "Excited to contribute."},
        headers=student_headers,
    )

    recruiter_headers = auth_headers(client, "priya@example.com")
    response = client.get(f"/api/internships/{internship.id}/applications", headers=recruiter_headers)

    assert response.status_code == 200
    applicant = response.json()[0]
    assert applicant["student"]["name"] == "Aarav"
    assert applicant["student"]["skills"] == ["Python", "SQL"]
    assert applicant["cover_note"] == "Excited to contribute."
    assert "hashed_password" not in applicant["student"]


def test_status_change_persists(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    internship = _create_internship(db_session, recruiter.id)

    student_headers = auth_headers(client, "aarav@example.com")
    apply_response = client.post(
        f"/api/internships/{internship.id}/applications", json={}, headers=student_headers
    )
    application_id = apply_response.json()["id"]

    recruiter_headers = auth_headers(client, "priya@example.com")
    client.patch(
        f"/api/applications/{application_id}", json={"status": "interview"}, headers=recruiter_headers
    )

    applicants = client.get(f"/api/internships/{internship.id}/applications", headers=recruiter_headers)
    assert applicants.json()[0]["status"] == "interview"


def test_other_recruiter_blocked_from_applicants(client, db_session):
    owner = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    other = make_user(db_session, name="Karan", email="karan@example.com", role="recruiter")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    internship = _create_internship(db_session, owner.id)

    student_headers = auth_headers(client, "aarav@example.com")
    client.post(f"/api/internships/{internship.id}/applications", json={}, headers=student_headers)

    other_headers = auth_headers(client, "karan@example.com")
    response = client.get(f"/api/internships/{internship.id}/applications", headers=other_headers)
    assert response.status_code == 403

    status_response = client.patch(
        f"/api/applications/1", json={"status": "shortlisted"}, headers=other_headers
    )
    assert status_response.status_code == 403


def test_skills_are_set_via_profile_endpoint_not_registration(client):
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Aarav", "email": "aarav@example.com", "password": "secret123", "role": "student"},
    )
    assert register_response.json()["skills"] == []

    login_response = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "secret123"}
    )
    headers = {"Authorization": f"Bearer {login_response.json()['token']}"}

    update_response = client.patch(
        "/api/users/me", json={"skills": ["Python", "SQL"]}, headers=headers
    )
    assert update_response.json()["skills"] == ["Python", "SQL"]
