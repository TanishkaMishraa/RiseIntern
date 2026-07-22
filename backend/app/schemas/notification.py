from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    message: str
    type: str
    link: str | None = None
    read: bool
    created_at: datetime


class NotificationUpdate(BaseModel):
    read: bool = True
