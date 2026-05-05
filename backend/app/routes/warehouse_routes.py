from fastapi import APIRouter
from app.services import warehouse_service

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    return warehouse_service.get_warehouse_dashboard()