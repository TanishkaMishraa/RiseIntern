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


def _apply_and_shortlist(client, db_session):
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
        f"/api/applications/{application_id}", json={"status": "shortlisted"}, headers=recruiter_headers
    )

    return student_headers


def test_status_change_creates_notification_for_student(client, db_session):
    student_headers = _apply_and_shortlist(client, db_session)

    response = client.get("/api/notifications", headers=student_headers)
    assert response.status_code == 200
    notifications = response.json()
    assert len(notifications) == 1
    assert "shortlisted" in notifications[0]["message"]
    assert notifications[0]["type"] == "application_status"
    assert notifications[0]["link"] == "/applications"
    assert notifications[0]["read"] is False


def test_notification_not_visible_to_other_users(client, db_session):
    _apply_and_shortlist(client, db_session)

    make_user(db_session, name="Other Student", email="other@example.com", role="student")
    other_headers = auth_headers(client, "other@example.com")

    response = client.get("/api/notifications", headers=other_headers)
    assert response.json() == []


def test_unread_count_reflects_and_decrements(client, db_session):
    student_headers = _apply_and_shortlist(client, db_session)

    count_response = client.get("/api/notifications/unread-count", headers=student_headers)
    assert count_response.json()["count"] == 1

    notification_id = client.get("/api/notifications", headers=student_headers).json()[0]["id"]
    client.patch(f"/api/notifications/{notification_id}", json={"read": True}, headers=student_headers)

    count_after = client.get("/api/notifications/unread-count", headers=student_headers)
    assert count_after.json()["count"] == 0


def test_mark_all_read(client, db_session):
    student_headers = _apply_and_shortlist(client, db_session)

    client.post("/api/notifications/read-all", headers=student_headers)

    count_response = client.get("/api/notifications/unread-count", headers=student_headers)
    assert count_response.json()["count"] == 0


def test_cannot_read_or_mark_another_users_notification(client, db_session):
    student_headers = _apply_and_shortlist(client, db_session)
    notification_id = client.get("/api/notifications", headers=student_headers).json()[0]["id"]

    make_user(db_session, name="Other Student", email="other@example.com", role="student")
    other_headers = auth_headers(client, "other@example.com")

    response = client.patch(
        f"/api/notifications/{notification_id}", json={"read": True}, headers=other_headers
    )
    assert response.status_code == 404

    # the original owner's notification must remain unaffected
    unread = client.get("/api/notifications/unread-count", headers=student_headers)
    assert unread.json()["count"] == 1
