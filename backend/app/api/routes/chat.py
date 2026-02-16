from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import get_current_user
from app.services.gemini import generate_response

router = APIRouter()


class Message(BaseModel):
    role: str       # "user" or "model"
    text: str


class ChatRequest(BaseModel):
    messages: list[Message]
    level: str = "beginner"     # beginner | intermediate | advanced


class ChatResponse(BaseModel):
    reply: str


@router.post("", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Proxies the conversation to Gemini API.
    The API key is NEVER sent to the frontend — it lives only here.
    """
    if not body.messages:
        raise HTTPException(status_code=400, detail="Messages array cannot be empty.")

    # Convert to Gemini format
    history = [
        {"role": msg.role, "parts": [{"text": msg.text}]}
        for msg in body.messages
    ]

    reply = await generate_response(
        messages=history,
        user_level=body.level,
    )

    # TODO: Persist conversation to Firestore (user_id = current_user["uid"])

    return ChatResponse(reply=reply)
