from tests.conftest import make_user


def test_register_and_login(client):
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Aarav", "email": "aarav@example.com", "password": "secret123", "role": "student"},
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "secret123"}
    )
    assert login_response.status_code == 200
    body = login_response.json()
    assert body["token"]
    assert body["user"]["email"] == "aarav@example.com"


def test_login_with_wrong_password_fails(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")

    response = client.post(
        "/api/auth/login", json={"email": "aarav@example.com", "password": "wrong"}
    )
    assert response.status_code == 401


def test_me_requires_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_duplicate_registration_rejected(client):
    payload = {"name": "Aarav", "email": "aarav@example.com", "password": "secret123", "role": "student"}
    client.post("/api/auth/register", json=payload)
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 409
