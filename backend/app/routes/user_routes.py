from fastapi import APIRouter, Depends
from app.services import user_service
from app.utils.deps import get_current_user

router = APIRouter()

@router.get("/dashboard")
def dashboard(user=Depends(get_current_user)):
    return {
        "message": "User Dashboard",
        "user": user
    }