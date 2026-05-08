from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.database import models
from app.database.schemas import WarehouseProductCreate, WarehouseProductUpdate, RetailerProductCreate

def get_warehouse_products(db: Session):
    try:
        return db.query(models.WarehouseProduct).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))

def create_warehouse_product(db: Session, data: WarehouseProductCreate):
    try:
        product = models.WarehouseProduct(**data.model_dump())
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

def update_warehouse_product(db: Session, product_id: int, data: WarehouseProductUpdate):
    try:
        product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)
            
        db.commit()
        db.refresh(product)
        return product
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

def update_warehouse_stock(db: Session, product_id: int, new_quantity: int):
    try:
        product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        product.quantity = new_quantity
        db.commit()
        db.refresh(product)
        return product
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

def get_retailer_products(db: Session, retailer_id: int):
    try:
        return db.query(models.RetailerProduct).filter(models.RetailerProduct.retailer_id == retailer_id).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))

def create_retailer_product(db: Session, data: RetailerProductCreate):
    try:
        product = models.RetailerProduct(**data.model_dump())
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

# Admin approval logic
def approve_product_to_retailer(db: Session, warehouse_product_id: int, retailer_id: int, quantity_to_move: int):
    try:
        w_product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.id == warehouse_product_id).first()
        if not w_product:
            raise HTTPException(status_code=404, detail="Warehouse product not found")
        
        if w_product.quantity < quantity_to_move:
            raise HTTPException(status_code=400, detail="Insufficient quantity in warehouse")
            
        w_product.quantity -= quantity_to_move
            
        r_product = models.RetailerProduct(
            retailer_id=retailer_id,
            name=w_product.name,
            price=w_product.price,
            quantity=quantity_to_move,
            image_url=w_product.image_url
        )
        db.add(r_product)
        
        # Log transaction
        log_entry = models.Log(
            action="Product Dispatched",
            details=f"Dispatched {quantity_to_move} of {w_product.name} to retailer {retailer_id}"
        )
        db.add(log_entry)
        
        db.commit()
        db.refresh(w_product)
        db.refresh(r_product)
        return {"message": "Product approved and moved to retailer successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")