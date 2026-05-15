
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.schemas import UserCreate, UserLogin, UserResponse
from app.services import auth_service
from app.utils.deps import get_db
import logging

# Setup logging to see errors in your terminal
logger = logging.getLogger("uvicorn.error")

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = auth_service.create_user(db, data)
        if not user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return user
    except Exception as e:
        logger.error(f"Registration Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Database connection failed. Check Azure Firewall/ODBC Driver."
        )

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    try:
        result = auth_service.login_user(db, data.email, data.password)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return result
    except Exception as e:
        logger.error(f"Login Database Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Backend cannot reach Database.")

@router.get("/admins", response_model=List[UserResponse])
def get_admins(db: Session = Depends(get_db)):
    try:
        from app.database.models import User
        admins = db.query(User).filter(User.role == "admin").all()
        return admins
    except Exception as e:
        logger.error(f"Error fetching admins: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch admins")