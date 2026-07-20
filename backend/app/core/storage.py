import uuid
from pathlib import Path

from app.core.config import get_settings

settings = get_settings()


def _storage_path() -> Path:
    path = Path(settings.storage_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_file(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix
    stored_name = f"{uuid.uuid4().hex}{suffix}"
    destination = _storage_path() / stored_name
    destination.write_bytes(content)
    return str(destination)


def read_file(stored_path: str) -> bytes:
    return Path(stored_path).read_bytes()


def delete_file(stored_path: str) -> None:
    path = Path(stored_path)
    if path.exists():
        path.unlink()
