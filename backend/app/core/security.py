import hashlib
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

EMAIL_VERIFICATION_EXPIRE_MINUTES = 60 * 24
PASSWORD_RESET_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _password_fingerprint(hashed_password: str) -> str:
    """Non-reversible fingerprint of a password hash.

    Embedding this in reset tokens makes them single-use: once the password
    changes, the fingerprint no longer matches and any outstanding token
    (even if unexpired) is rejected.
    """
    return hashlib.sha256(hashed_password.encode()).hexdigest()[:16]


def _encode(payload: dict, expires_minutes: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    return jwt.encode({**payload, "exp": expire}, settings.secret_key, algorithm=settings.algorithm)


def _decode(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    return _encode(
        {"sub": subject, "purpose": "access"},
        expires_minutes or settings.access_token_expire_minutes,
    )


def decode_access_token(token: str) -> str | None:
    payload = _decode(token)
    if not payload or payload.get("purpose") != "access":
        return None
    return payload.get("sub")


def create_email_verification_token(email: str) -> str:
    return _encode({"sub": email, "purpose": "verify"}, EMAIL_VERIFICATION_EXPIRE_MINUTES)


def decode_email_verification_token(token: str) -> str | None:
    payload = _decode(token)
    if not payload or payload.get("purpose") != "verify":
        return None
    return payload.get("sub")


def create_password_reset_token(email: str, hashed_password: str) -> str:
    return _encode(
        {"sub": email, "purpose": "reset", "pwfp": _password_fingerprint(hashed_password)},
        PASSWORD_RESET_EXPIRE_MINUTES,
    )


def peek_password_reset_email(token: str) -> str | None:
    """Return the token's subject without checking the fingerprint.

    Used only to look up which user's current hashed_password to check the
    fingerprint against — callers MUST still call
    ``decode_password_reset_token`` with that user's hash before trusting
    the token.
    """
    payload = _decode(token)
    if not payload or payload.get("purpose") != "reset":
        return None
    return payload.get("sub")


def decode_password_reset_token(token: str, current_hashed_password: str) -> str | None:
    payload = _decode(token)
    if not payload or payload.get("purpose") != "reset":
        return None
    if payload.get("pwfp") != _password_fingerprint(current_hashed_password):
        return None
    return payload.get("sub")
