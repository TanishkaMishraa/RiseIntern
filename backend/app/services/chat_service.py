import logging

import anthropic

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

SYSTEM_PROMPT = """You are the RiseIntern Help Bot, a support assistant for RiseIntern — an \
internship-matching platform for Indian students, built around the PM Internship Scheme.

What RiseIntern actually does, so you can answer accurately:
- Students browse internships or check their Recommendations, which uses AI-powered semantic \
matching between a student's listed skills and each internship's required skills.
- Students apply directly from a listing, with an optional cover note.
- An application's status moves through Applied -> Shortlisted -> Interview -> Offered or \
Rejected. The student gets a notification, both in-app and by email, every time the status \
changes.
- Recruiters post internships and review applicants on a kanban-style board.
- The whole platform is available in English and Hindi.

Your job is to help students with: (1) resume tips, (2) interview preparation, and (3) how to \
use RiseIntern — applying, tracking application status, and improving their match score. Keep \
answers concise and practical.

You do not have access to any individual user's account, applications, resume, or personal \
data — you cannot look up someone's real application status or match score. If asked for \
that, say so plainly and point them to the relevant page in the app (My Applications, \
Recommendations) instead of guessing. If asked something unrelated to careers, resumes, \
interviews, or RiseIntern itself, politely redirect to what you can help with."""


def get_chat_response(message: str, history: list[dict[str, str]]) -> str:
    if not settings.anthropic_api_key:
        raise RuntimeError("Chat is not configured: ANTHROPIC_API_KEY is not set")

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    try:
        response = client.messages.create(
            model=settings.chat_model,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[*history, {"role": "user", "content": message}],
        )
    except anthropic.AuthenticationError:
        logger.exception("Anthropic API key is invalid")
        raise RuntimeError("Chat is not configured correctly") from None
    except anthropic.RateLimitError:
        raise RuntimeError("The help bot is busy right now — please try again shortly") from None
    except anthropic.APIError:
        logger.exception("Anthropic API request failed")
        raise RuntimeError("The help bot couldn't respond — please try again") from None

    if response.stop_reason == "refusal":
        return "I can't help with that request — feel free to ask me something else about resumes, interviews, or using RiseIntern."

    return "".join(block.text for block in response.content if block.type == "text")
