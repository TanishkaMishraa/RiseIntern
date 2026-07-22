import io

from tests.conftest import auth_headers, make_user


def test_reject_non_pdf(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    response = client.post(
        "/api/resumes",
        files={"resume": ("resume.txt", io.BytesIO(b"just some text"), "text/plain")},
        headers=headers,
    )
    assert response.status_code == 400


def test_reject_oversized_file(client, db_session, monkeypatch):
    from app.core import config

    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    settings = config.get_settings()
    oversized = b"%PDF-1.4\n" + b"0" * (settings.max_resume_size_mb * 1024 * 1024 + 1)

    response = client.post(
        "/api/resumes",
        files={"resume": ("resume.pdf", io.BytesIO(oversized), "application/pdf")},
        headers=headers,
    )
    assert response.status_code == 400


def test_valid_resume_returns_extracted_skills(client, db_session, monkeypatch):
    from app.api.routes import resumes as resumes_route

    monkeypatch.setattr(
        resumes_route,
        "extract_text",
        lambda contents, filename: "Experienced with Python, SQL, and Figma.",
    )

    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    response = client.post(
        "/api/resumes",
        files={"resume": ("resume.pdf", io.BytesIO(b"%PDF-1.4\nfake but small"), "application/pdf")},
        headers=headers,
    )
    assert response.status_code == 201
    body = response.json()
    assert set(body["extracted_skills"]) == {"Python", "SQL", "Figma"}


def test_upload_does_not_silently_overwrite_profile_skills(client, db_session, monkeypatch):
    from app.api.routes import resumes as resumes_route

    monkeypatch.setattr(
        resumes_route, "extract_text", lambda contents, filename: "Python and SQL expert."
    )

    make_user(db_session, name="Aarav", email="aarav@example.com", role="student", skills=["Figma"])
    headers = auth_headers(client, "aarav@example.com")

    client.post(
        "/api/resumes",
        files={"resume": ("resume.pdf", io.BytesIO(b"%PDF-1.4\nfake"), "application/pdf")},
        headers=headers,
    )

    me = client.get("/api/auth/me", headers=headers)
    assert me.json()["skills"] == ["Figma"]


def test_only_owner_can_access_their_resume(client, db_session, monkeypatch):
    from app.api.routes import resumes as resumes_route

    monkeypatch.setattr(resumes_route, "extract_text", lambda contents, filename: "Python.")

    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    make_user(db_session, name="Priya", email="priya@example.com", role="student")

    aarav_headers = auth_headers(client, "aarav@example.com")
    priya_headers = auth_headers(client, "priya@example.com")

    client.post(
        "/api/resumes",
        files={"resume": ("resume.pdf", io.BytesIO(b"%PDF-1.4\nfake"), "application/pdf")},
        headers=aarav_headers,
    )

    own = client.get("/api/resumes/me", headers=aarav_headers)
    assert own.status_code == 200

    other = client.get("/api/resumes/me", headers=priya_headers)
    assert other.status_code == 404
