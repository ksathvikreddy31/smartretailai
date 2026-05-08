from sqlalchemy.orm import Session
from app.database import models
from app.database.schemas import UserCreate
from app.core.security import hash_password, verify_password, create_access_token

def create_user(db: Session, data: UserCreate):
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        return None

    user = models.User(
        email=data.email,
        password=hash_password(data.password),
        role=data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not verify_password(password, user.password):
        return None

    token = create_access_token({
        "sub": user.email,
        "id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "id": user.id,
        "role": user.role
    }