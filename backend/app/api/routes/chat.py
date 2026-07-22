from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import get_chat_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def send_chat_message(payload: ChatRequest, _: User = Depends(get_current_user)):
    history = [{"role": m.role, "content": m.content} for m in payload.history]
    try:
        reply = get_chat_response(payload.message, history)
    except RuntimeError as err:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(err)) from err

    return ChatResponse(reply=reply)
