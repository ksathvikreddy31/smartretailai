from fastapi import APIRouter
from app.services import retail_service

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    return retail_service.get_retail_dashboard()