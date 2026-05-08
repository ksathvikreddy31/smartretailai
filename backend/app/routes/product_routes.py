from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import models
from app.database.schemas import WarehouseProductCreate, WarehouseProductResponse, WarehouseProductUpdate, RetailerProductCreate, RetailerProductResponse
from app.services import product_service
from app.utils.deps import get_db

router = APIRouter()

@router.get("/warehouse", response_model=List[WarehouseProductResponse])
def get_warehouse_products(db: Session = Depends(get_db)):
    try:
        products = product_service.get_warehouse_products(db)
        print(f"[FETCH] Retrieved {len(products)} products from warehouse_products table")
        return products
    except Exception as e:
        print(f"[ERROR] Failed to fetch products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/warehouse", response_model=WarehouseProductResponse)
def add_warehouse_product(data: WarehouseProductCreate, db: Session = Depends(get_db)):
    try:
        # Log the incoming request
        print(f"[ADD PRODUCT] Received data: name={data.name}, price={data.price}, quantity={data.quantity}, image_url={data.image_url}")
        
        # Create the product instance
        new_product = models.WarehouseProduct(**data.model_dump())
        db.add(new_product)
        
        # Commit explicitly to save to Azure SQL
        db.commit()
        print(f"[SUCCESS] Product committed with ID: {new_product.id}")
        
        # Refresh to get updated data from DB
        db.refresh(new_product)
        print(f"[SUCCESS] Product refreshed from database")
        
        return new_product
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to add product: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.patch("/warehouse/{product_id}", response_model=WarehouseProductResponse)
def update_warehouse_product(product_id: int, data: WarehouseProductUpdate, db: Session = Depends(get_db)):
    return product_service.update_warehouse_product(db, product_id, data)

@router.patch("/warehouse/{product_id}/stock", response_model=WarehouseProductResponse)
def update_warehouse_stock(product_id: int, quantity: int = Query(...), db: Session = Depends(get_db)):
    return product_service.update_warehouse_stock(db, product_id, quantity)

@router.delete("/warehouse/{product_id}")
def delete_warehouse_product(product_id: int, db: Session = Depends(get_db)):
    try:
        print(f"[DELETE] Attempting to delete product ID: {product_id}")
        product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.id == product_id).first()
        
        if not product:
            print(f"[ERROR] Product ID {product_id} not found")
            raise HTTPException(status_code=404, detail="Product not found")
        
        product_name = product.name
        db.delete(product)
        db.commit()
        print(f"[SUCCESS] Product '{product_name}' (ID: {product_id}) deleted successfully")
        
        return {"message": f"Product '{product_name}' deleted successfully", "id": product_id}
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to delete product: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.get("/retailer/{retailer_id}", response_model=List[RetailerProductResponse])
def get_retailer_products(retailer_id: int, db: Session = Depends(get_db)):
    return product_service.get_retailer_products(db, retailer_id)

@router.post("/retailer", response_model=RetailerProductResponse)
def add_retailer_product(data: RetailerProductCreate, db: Session = Depends(get_db)):
    try:
        warehouse_product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.name == data.name).first()
        if not warehouse_product:
            raise HTTPException(status_code=404, detail="Product not found in warehouse inventory")
        
        if warehouse_product.quantity < data.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Only {warehouse_product.quantity} units available.")
        
        warehouse_product.quantity -= data.quantity
        
        existing = db.query(models.RetailerProduct).filter(
            models.RetailerProduct.retailer_id == data.retailer_id,
            models.RetailerProduct.name == data.name
        ).first()
        
        if existing:
            existing.quantity += data.quantity
            existing.price = data.price
            db.commit()
            db.refresh(existing)
            return existing
        else:
            new_product = models.RetailerProduct(**data.model_dump())
            db.add(new_product)
            db.commit()
            db.refresh(new_product)
            return new_product
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.patch("/retailer/{product_id}", response_model=RetailerProductResponse)
def update_retailer_product(product_id: int, data: dict, db: Session = Depends(get_db)):
    try:
        product = db.query(models.RetailerProduct).filter(models.RetailerProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if "quantity" in data:
            new_qty = int(data["quantity"])
            diff = new_qty - product.quantity
            
            if diff > 0:
                warehouse_product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.name == product.name).first()
                if not warehouse_product or warehouse_product.quantity < diff:
                    raise HTTPException(status_code=400, detail="Insufficient warehouse stock")
                warehouse_product.quantity -= diff
            elif diff < 0:
                warehouse_product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.name == product.name).first()
                if warehouse_product:
                    warehouse_product.quantity += abs(diff)
            
            product.quantity = new_qty
            
        if "price" in data:
            product.price = float(data["price"])
            
        db.commit()
        db.refresh(product)
        return product
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/retailer/{product_id}")
def delete_retailer_product(product_id: int, db: Session = Depends(get_db)):
    try:
        product = db.query(models.RetailerProduct).filter(models.RetailerProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        warehouse_product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.name == product.name).first()
        if warehouse_product:
            warehouse_product.quantity += product.quantity
            
        db.delete(product)
        db.commit()
        return {"message": "Product deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/all", response_model=List[RetailerProductResponse])
def get_all_retailer_products(db: Session = Depends(get_db)):
    try:
        products = db.query(models.RetailerProduct).all()
        # Attach retailer name for UI convenience
        for p in products:
            p.retailer_name = p.retailer.email.split("@")[0].capitalize() if p.retailer else "Retailer"
        return products
    except Exception as e:
        print(f"[ERROR] Failed to fetch all products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve")
def approve_product(warehouse_product_id: int = Query(...), retailer_id: int = Query(...), quantity: int = Query(...), db: Session = Depends(get_db)):
    return product_service.approve_product_to_retailer(db, warehouse_product_id, retailer_id, quantity)