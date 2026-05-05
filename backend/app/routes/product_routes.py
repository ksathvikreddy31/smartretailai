from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.schemas import ProductCreate, ProductResponse
from app.services import product_service
from app.utils.deps import get_db

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return product_service.get_products(db)

@router.post("/", response_model=ProductResponse)
def add_product(data: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, data)