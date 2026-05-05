from sqlalchemy.orm import Session
from app.database import models
from app.database.schemas import ProductCreate

def get_products(db: Session):
    return db.query(models.Product).all()

def create_product(db: Session, data: ProductCreate):
    # Use model_dump() instead of dict() for Pydantic V2
    product = models.Product(**data.model_dump())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product