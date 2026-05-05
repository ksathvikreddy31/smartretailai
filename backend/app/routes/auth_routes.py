from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.schemas import UserCreate, UserLogin, UserResponse
from app.services import auth_service
from app.utils.deps import get_db

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = auth_service.create_user(db, data)
    if not user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    result = auth_service.login_user(db, data.email, data.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return result