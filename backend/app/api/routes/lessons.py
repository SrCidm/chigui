from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()


@router.get("")
async def get_lessons(current_user: dict = Depends(get_current_user)):
    """TODO: Implement lessons logic"""
    return {"message": "lessons endpoint — coming soon", "uid": current_user["uid"]}
