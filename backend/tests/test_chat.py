from types import SimpleNamespace
from unittest.mock import patch

from tests.conftest import auth_headers, make_user


def test_chat_requires_authentication(client):
    response = client.post("/api/chat", json={"message": "How do I apply?"})
    assert response.status_code == 401


def test_chat_returns_503_when_not_configured(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    with patch("app.services.chat_service.settings.anthropic_api_key", ""):
        response = client.post("/api/chat", json={"message": "How do I apply?"}, headers=headers)

    assert response.status_code == 503


def test_chat_returns_reply_from_claude(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    fake_response = SimpleNamespace(
        stop_reason="end_turn",
        content=[SimpleNamespace(type="text", text="Click Apply on any listing to get started.")],
    )

    with patch("app.services.chat_service.settings.anthropic_api_key", "test-key"), patch(
        "app.services.chat_service.anthropic.Anthropic"
    ) as mock_anthropic:
        mock_anthropic.return_value.messages.create.return_value = fake_response
        response = client.post(
            "/api/chat",
            json={"message": "How do I apply to an internship?"},
            headers=headers,
        )

    assert response.status_code == 200
    assert response.json()["reply"] == "Click Apply on any listing to get started."

    call_kwargs = mock_anthropic.return_value.messages.create.call_args.kwargs
    assert call_kwargs["messages"][-1] == {
        "role": "user",
        "content": "How do I apply to an internship?",
    }


def test_chat_handles_refusal(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    fake_response = SimpleNamespace(stop_reason="refusal", content=[])

    with patch("app.services.chat_service.settings.anthropic_api_key", "test-key"), patch(
        "app.services.chat_service.anthropic.Anthropic"
    ) as mock_anthropic:
        mock_anthropic.return_value.messages.create.return_value = fake_response
        response = client.post("/api/chat", json={"message": "something off-topic"}, headers=headers)

    assert response.status_code == 200
    assert "can't help" in response.json()["reply"].lower()


def test_chat_sends_conversation_history(client, db_session):
    make_user(db_session, name="Aarav", email="aarav@example.com", role="student")
    headers = auth_headers(client, "aarav@example.com")

    fake_response = SimpleNamespace(
        stop_reason="end_turn", content=[SimpleNamespace(type="text", text="Sure, here's more detail.")]
    )

    with patch("app.services.chat_service.settings.anthropic_api_key", "test-key"), patch(
        "app.services.chat_service.anthropic.Anthropic"
    ) as mock_anthropic:
        mock_anthropic.return_value.messages.create.return_value = fake_response
        response = client.post(
            "/api/chat",
            json={
                "message": "Can you say more?",
                "history": [
                    {"role": "user", "content": "How do I apply?"},
                    {"role": "assistant", "content": "Click Apply on any listing."},
                ],
            },
            headers=headers,
        )

    assert response.status_code == 200
    call_kwargs = mock_anthropic.return_value.messages.create.call_args.kwargs
    assert call_kwargs["messages"][0] == {"role": "user", "content": "How do I apply?"}
    assert call_kwargs["messages"][1] == {"role": "assistant", "content": "Click Apply on any listing."}
    assert call_kwargs["messages"][2] == {"role": "user", "content": "Can you say more?"}
