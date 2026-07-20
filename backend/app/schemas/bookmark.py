from pydantic import BaseModel


class BookmarkCreate(BaseModel):
    internshipId: int
