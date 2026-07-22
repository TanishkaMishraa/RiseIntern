from datetime import datetime, timedelta, timezone

from app.models.internship import Internship
from app.tasks.emails import _queue
from tests.conftest import auth_headers, make_user


def _create_internship(db_session, recruiter_id):
    internship = Internship(
        title="Backend Intern",
        domain="Software Development",
        description="x",
        skills_required=["Python"],
        deadline=datetime.now(timezone.utc) + timedelta(days=10),
        recruiter_id=recruiter_id,
    )
    db_session.add(internship)
    db_session.commit()
    db_session.refresh(internship)
    return internship


def test_apply_status_change_and_notification_flow(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    internship = _create_internship(db_session, recruiter.id)

    student_headers = auth_headers(client, "aarav@example.com")
    apply_response = client.post(
        f"/api/internships/{internship.id}/applications", json={}, headers=student_headers
    )
    assert apply_response.status_code == 201
    application_id = apply_response.json()["id"]

    duplicate_response = client.post(
        f"/api/internships/{internship.id}/applications", json={}, headers=student_headers
    )
    assert duplicate_response.status_code == 409

    my_apps = client.get("/api/applications/me", headers=student_headers)
    assert my_apps.json()[0]["internshipTitle"] == "Backend Intern"

    recruiter_headers = auth_headers(client, "priya@example.com")
    applicants = client.get(f"/api/internships/{internship.id}/applications", headers=recruiter_headers)
    assert len(applicants.json()) == 1
    assert applicants.json()[0]["student"]["name"] == "Aarav"

    status_response = client.patch(
        f"/api/applications/{application_id}", json={"status": "shortlisted"}, headers=recruiter_headers
    )
    assert status_response.status_code == 200
    assert status_response.json()["status"] == "shortlisted"

    notifications = client.get("/api/notifications", headers=student_headers)
    assert len(notifications.json()) == 1
    assert "shortlisted" in notifications.json()[0]["message"]

    # Status-change emails go through the async queue, not a synchronous
    # SMTP call in the request path.
    assert len(_queue) == 1
    assert _queue[0].to == "aarav@example.com"
    assert "shortlisted" in _queue[0].body
