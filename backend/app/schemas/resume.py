from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    extracted_skills: list[str]
    created_at: datetime
