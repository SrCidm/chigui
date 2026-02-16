from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()


@router.get("")
async def get_progress(current_user: dict = Depends(get_current_user)):
    """TODO: Implement progress logic"""
    return {"message": "progress endpoint — coming soon", "uid": current_user["uid"]}
