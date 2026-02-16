from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
from app.core.security import get_current_user
from app.services.gemini import get_gemini_response

router = APIRouter()
logger = logging.getLogger(__name__)

class Message(BaseModel):
    role: str
    text: str
    image: Optional[str] = None  # Base64 image data

class ChatRequest(BaseModel):
    messages: List[Message]
    level: str = "beginner"

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Chat with Chigui AI - Supports text and images
    """
    try:
        # Convert messages to Gemini format
        gemini_messages = []
        
        for msg in request.messages:
            if msg.image:
                # Message with image (Gemini Vision)
                # Extract base64 data (remove data:image/jpeg;base64, prefix if present)
                image_data = msg.image
                if "," in image_data:
                    image_data = image_data.split(",")[1]
                
                gemini_messages.append({
                    "role": msg.role,
                    "parts": [
                        {"text": msg.text},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": image_data
                            }
                        }
                    ]
                })
            else:
                # Text-only message
                gemini_messages.append({
                    "role": msg.role,
                    "parts": [{"text": msg.text}]
                })
        
        # Get response from Gemini
        response = await get_gemini_response(gemini_messages, request.level)
        
        return {"reply": response}
    
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "chigui-chat"}