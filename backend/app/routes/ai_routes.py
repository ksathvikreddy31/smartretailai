from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services import ai_service
from app.utils.deps import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.get("/forecast")
def get_demand_forecast(user: dict = Depends(get_current_user)):
    return ai_service.generate_forecast()

@router.get("/anomalies")
def get_anomaly_alerts(user: dict = Depends(get_current_user)):
    return ai_service.detect_anomalies()

@router.post("/chat")
def chat_with_ai(query: ChatRequest, user: dict = Depends(get_current_user)):
    return ai_service.process_chat_query(query.message, user.get("role"))
