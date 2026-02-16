from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()


@router.get("")
async def get_achievements(current_user: dict = Depends(get_current_user)):
    """TODO: Implement achievements logic"""
    return {"message": "achievements endpoint — coming soon", "uid": current_user["uid"]}
