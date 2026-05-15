
from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.utils.deps import (
    get_db,
    get_current_user
)

# ==========================================
# QA AGENT  (for customers / "user" role)
# ==========================================
from agent.qa_Agent.agent import ask_qa_agent

# ==========================================
# ORCHESTRATOR  (for retail owners)
# ==========================================
from agent.orchestrator_agent.orchestrator import (
    OrchestratorAgent
)

# ==========================================
# ROUTER
# ==========================================

router = APIRouter()

# ==========================================
# ORCHESTRATOR INSTANCE
# ==========================================
orchestrator = OrchestratorAgent()


# ==========================================
# CHAT REQUEST SCHEMA
# ==========================================
class ChatRequest(BaseModel):

    message: str

    context: str = "user"   # "user" | "retail"


# ==========================================
# /ai/chat  ←  CUSTOMER CHATBOT
# This is what Chatbot.jsx calls.
# ==========================================
@router.post("/chat")
def customer_chat(

    body: ChatRequest,

    db: Session = Depends(get_db),

    user: dict = Depends(get_current_user)
):

    try:

        print("\nCUSTOMER QUERY:", body.message)

        reply = ask_qa_agent(

            query=body.message,

            customer_id=user["id"]
        )

        print("\nQA REPLY:", reply)

        return {"reply": reply}

    except Exception as e:

        print("AI /chat ERROR:", e)

        return {"reply": "Sorry, I couldn't process your request. Please try again."}


# ==========================================
# /ai/retail-chat  ←  RETAIL OWNER CHATBOT
# Routes to analytics / ML / QA via orchestrator.
# ==========================================
@router.post("/retail-chat")
def retail_chat(

    body: ChatRequest,

    db: Session = Depends(get_db),

    user: dict = Depends(get_current_user)
):

    try:

        print("\nRETAIL QUERY:", body.message)

        response = orchestrator.run(

            query=body.message,

            role=user["role"],

            user_id=user["id"],

            db=db
        )

        print("\nFINAL API RESPONSE:", response)

        return response

    except Exception as e:

        print("AI /retail-chat ERROR:", e)

        return {
            "success": False,
            "message": str(e)
        }