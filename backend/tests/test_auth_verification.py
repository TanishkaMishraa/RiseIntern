import re

from app.tasks.emails import _queue
from tests.conftest import auth_headers, make_user


def _register(client, email="aarav@example.com"):
    return client.post(
        "/api/auth/register",
        json={"name": "Aarav", "email": email, "password": "secret123", "role": "student"},
    )


def _last_queued_token():
    body = _queue[-1].body
    match = re.search(r"token=(\S+)", body)
    assert match, f"no token found in queued email body: {body}"
    return match.group(1)


def test_register_enqueues_verification_email_instead_of_sending_inline(client):
    response = _register(client)
    assert response.status_code == 201
    assert len(_queue) == 1
    assert _queue[0].to == "aarav@example.com"
    assert "Verify your RiseIntern account" == _queue[0].subject


def test_new_user_is_unverified_until_link_clicked(client, db_session):
    _register(client)
    body = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "secret123"}
    ).json()
    assert body["user"]["is_verified"] is False

    token = _last_queued_token()
    verify_response = client.get(f"/api/auth/verify-email?token={token}")
    assert verify_response.status_code == 200

    me_response = client.get("/api/auth/me", headers=auth_headers(client, "aarav@example.com", "secret123"))
    assert me_response.json()["is_verified"] is True


def test_verify_email_rejects_garbage_token(client):
    response = client.get("/api/auth/verify-email?token=not-a-real-token")
    assert response.status_code == 400


def test_verify_email_rejects_a_login_access_token(client):
    _register(client)
    headers = auth_headers(client, "aarav@example.com", "secret123")
    access_token = headers["Authorization"].split(" ")[1]

    response = client.get(f"/api/auth/verify-email?token={access_token}")
    assert response.status_code == 400


def test_forgot_password_unknown_email_returns_generic_message_and_sends_nothing(client):
    response = client.post("/api/auth/forgot-password", json={"email": "nobody@example.com"})
    assert response.status_code == 200
    assert "if that email exists" in response.json()["detail"].lower()
    assert len(_queue) == 0


def test_forgot_password_known_email_returns_same_generic_message(client):
    _register(client)
    _queue.clear()

    response = client.post("/api/auth/forgot-password", json={"email": "aarav@example.com"})
    assert response.status_code == 200
    assert "if that email exists" in response.json()["detail"].lower()
    assert len(_queue) == 1
    assert _queue[0].subject == "Reset your RiseIntern password"


def test_reset_password_changes_password_and_old_password_stops_working(client):
    _register(client)
    _queue.clear()
    client.post("/api/auth/forgot-password", json={"email": "aarav@example.com"})
    token = _last_queued_token()

    reset_response = client.post(
        "/api/auth/reset-password", json={"token": token, "new_password": "newsecret456"}
    )
    assert reset_response.status_code == 200

    old_login = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "secret123"}
    )
    assert old_login.status_code == 401

    new_login = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "newsecret456"}
    )
    assert new_login.status_code == 200


def test_reset_password_token_cannot_be_reused_after_password_changes(client):
    _register(client)
    _queue.clear()
    client.post("/api/auth/forgot-password", json={"email": "aarav@example.com"})
    token = _last_queued_token()

    first = client.post(
        "/api/auth/reset-password", json={"token": token, "new_password": "newsecret456"}
    )
    assert first.status_code == 200

    replay = client.post(
        "/api/auth/reset-password", json={"token": token, "new_password": "anothersecret789"}
    )
    assert replay.status_code == 400


def test_reset_password_rejects_a_login_access_token(client):
    _register(client)
    headers = auth_headers(client, "aarav@example.com", "secret123")
    access_token = headers["Authorization"].split(" ")[1]

    response = client.post(
        "/api/auth/reset-password", json={"token": access_token, "new_password": "newsecret456"}
    )
    assert response.status_code == 400


def test_reset_password_rejects_short_password(client):
    _register(client)
    _queue.clear()
    client.post("/api/auth/forgot-password", json={"email": "aarav@example.com"})
    token = _last_queued_token()

    response = client.post("/api/auth/reset-password", json={"token": token, "new_password": "short"})
    assert response.status_code == 422
