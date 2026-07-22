from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "RiseIntern API"
    environment: str = "development"

    database_url: str = "sqlite:///./riseintern.db"

    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    cors_origins: list[str] = ["http://localhost:5173"]
    frontend_url: str = "http://localhost:5173"

    sentry_dsn: str = ""

    anthropic_api_key: str = ""
    chat_model: str = "claude-opus-4-8"

    storage_dir: str = "./storage/resumes"
    max_resume_size_mb: int = 5

    smtp_host: str = "localhost"
    smtp_port: int = 1025
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "no-reply@riseintern.com"
    smtp_use_tls: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
