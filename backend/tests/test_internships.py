from datetime import datetime, timedelta, timezone

from tests.conftest import auth_headers, make_user


def _future_deadline():
    return (datetime.now(timezone.utc) + timedelta(days=10)).isoformat()


def test_recruiter_can_create_and_student_can_list(client, db_session):
    make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")

    recruiter_headers = auth_headers(client, "priya@example.com")
    create_response = client.post(
        "/api/internships",
        json={
            "title": "Backend Intern",
            "domain": "Software Development",
            "description": "Build APIs",
            "skills_required": ["Python", "SQL"],
            "stipend": 15000,
            "location": "Remote",
            "deadline": _future_deadline(),
        },
        headers=recruiter_headers,
    )
    assert create_response.status_code == 201

    list_response = client.get("/api/internships")
    assert list_response.status_code == 200
    listings = list_response.json()
    assert len(listings) == 1
    assert listings[0]["title"] == "Backend Intern"


def test_student_cannot_create_internship(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    response = client.post(
        "/api/internships",
        json={
            "title": "Backend Intern",
            "domain": "Software Development",
            "description": "Build APIs",
            "deadline": _future_deadline(),
        },
        headers=headers,
    )
    assert response.status_code == 403


def test_search_filters_results(client, db_session):
    recruiter = make_user(db_session, name="Priya", email="priya@example.com", role="recruiter")
    headers = auth_headers(client, "priya@example.com")

    client.post(
        "/api/internships",
        json={"title": "Backend Intern", "domain": "Software Development", "description": "x", "deadline": _future_deadline()},
        headers=headers,
    )
    client.post(
        "/api/internships",
        json={"title": "Design Intern", "domain": "Design", "description": "x", "deadline": _future_deadline()},
        headers=headers,
    )

    response = client.get("/api/internships", params={"domain": "Design"})
    results = response.json()
    assert len(results) == 1
    assert results[0]["title"] == "Design Intern"
