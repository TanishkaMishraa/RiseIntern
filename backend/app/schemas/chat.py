from pydantic import BaseModel, Field


class ChatHistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatHistoryMessage] = Field(default_factory=list, max_length=40)


class ChatResponse(BaseModel):
    reply: str
