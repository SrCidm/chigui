from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini import generate_response

router = APIRouter()


class TestMessage(BaseModel):
    text: str


@router.post("/test")
async def test_chat(body: TestMessage):
    """
    Test endpoint without authentication — for debugging only.
    Remove this in production.
    """
    try:
        messages = [
            {"role": "user", "parts": [{"text": body.text}]}
        ]
        reply = await generate_response(messages, "beginner")
        return {"reply": reply, "status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
