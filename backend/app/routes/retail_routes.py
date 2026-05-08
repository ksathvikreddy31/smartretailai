from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import models
from app.database.schemas import (
    MessageCreate, MessageResponse, 
    RestockRequestCreate, RestockRequestUpdate, RestockRequestResponse
)
from app.services import retail_service
from app.utils.deps import get_db, get_current_user

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    return retail_service.get_retail_dashboard()

# -------- MESSAGING ENDPOINTS --------
@router.post("/messages", response_model=MessageResponse)
def send_message(data: MessageCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retail owner sends message to warehouse admin"""
    try:
        sender_id = current_user.get("id")
        print(f"[MESSAGE] From user {sender_id} to {data.receiver_id}: {data.content}")
        
        message = models.Message(
            sender_id=sender_id,
            receiver_id=data.receiver_id,
            content=data.content,
            is_read=False
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        print(f"[SUCCESS] Message ID {message.id} saved to database")
        return message
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to send message: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.get("/messages/sent/{user_id}", response_model=List[MessageResponse])
def get_sent_messages(user_id: int, db: Session = Depends(get_db)):
    """Get all messages sent by a retail owner"""
    try:
        messages = db.query(models.Message).filter(models.Message.sender_id == user_id).order_by(models.Message.timestamp.desc()).all()
        return messages
    except Exception as e:
        print(f"[ERROR] Failed to fetch sent messages: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/messages/received/{user_id}", response_model=List[MessageResponse])
def get_received_messages(user_id: int, db: Session = Depends(get_db)):
    """Get all messages received by warehouse admin (unread count)"""
    try:
        messages = db.query(models.Message).filter(models.Message.receiver_id == user_id).order_by(models.Message.timestamp.desc()).all()
        return messages
    except Exception as e:
        print(f"[ERROR] Failed to fetch received messages: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.patch("/messages/{message_id}/read")
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    """Mark message as read by admin"""
    try:
        message = db.query(models.Message).filter(models.Message.id == message_id).first()
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")
        
        message.is_read = True
        db.commit()
        db.refresh(message)
        print(f"[MESSAGE] Message {message_id} marked as read")
        return message
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.get("/messages/unread-count/{user_id}")
def get_unread_count(user_id: int, db: Session = Depends(get_db)):
    """Get unread message count for admin dashboard notification"""
    try:
        count = db.query(models.Message).filter(
            models.Message.receiver_id == user_id,
            models.Message.is_read == False
        ).count()
        return {"unread_count": count}
    except Exception as e:
        print(f"[ERROR] Failed to get unread count: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# -------- RESTOCK REQUEST ENDPOINTS --------
@router.post("/restock", response_model=RestockRequestResponse)
def create_restock_request(data: RestockRequestCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retail owner creates restock request"""
    try:
        retailer_id = current_user.get("id")
        print(f"[RESTOCK] Retailer {retailer_id} requesting {data.requested_quantity} units of product {data.warehouse_product_id}")
        
        # Verify warehouse product exists
        product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.id == data.warehouse_product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found in warehouse")
        
        request = models.RestockRequest(
            retailer_id=retailer_id,
            warehouse_product_id=data.warehouse_product_id,
            requested_quantity=data.requested_quantity,
            message=data.message,
            status="Pending"
        )
        db.add(request)
        db.commit()
        db.refresh(request)
        print(f"[SUCCESS] Restock request ID {request.id} created")
        return request
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to create restock request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.get("/restock", response_model=List[RestockRequestResponse])
def get_all_restock_requests(db: Session = Depends(get_db)):
    """Admin gets all restock requests"""
    try:
        requests = db.query(models.RestockRequest).order_by(models.RestockRequest.created_at.desc()).all()
        return requests
    except Exception as e:
        print(f"[ERROR] Failed to fetch restock requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/restock/{retailer_id}", response_model=List[RestockRequestResponse])
def get_retailer_restock_requests(retailer_id: int, db: Session = Depends(get_db)):
    """Retail owner gets their own restock requests"""
    try:
        requests = db.query(models.RestockRequest).filter(models.RestockRequest.retailer_id == retailer_id).order_by(models.RestockRequest.created_at.desc()).all()
        return requests
    except Exception as e:
        print(f"[ERROR] Failed to fetch retailer restock requests: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.patch("/restock/{request_id}", response_model=RestockRequestResponse)
def update_restock_request(request_id: int, data: RestockRequestUpdate, db: Session = Depends(get_db)):
    """Admin approves/rejects restock request"""
    try:
        print(f"[RESTOCK] Updating request {request_id} to status: {data.status}")
        
        request = db.query(models.RestockRequest).filter(models.RestockRequest.id == request_id).first()
        if not request:
            raise HTTPException(status_code=404, detail="Restock request not found")
        
        old_status = request.status
        if data.status:
            request.status = data.status
        if data.admin_notes:
            request.admin_notes = data.admin_notes
        
        # If approved, create retailer product or update inventory
        if data.status == "Approved":
            product = db.query(models.WarehouseProduct).filter(models.WarehouseProduct.id == request.warehouse_product_id).first()
            
            # Check if retailer already has this product
            existing = db.query(models.RetailerProduct).filter(
                models.RetailerProduct.retailer_id == request.retailer_id,
                models.RetailerProduct.name == product.name
            ).first()
            
            if existing:
                # Update quantity
                existing.quantity += request.requested_quantity
                print(f"[INVENTORY] Updated existing product quantity for retailer")
            else:
                # Create new retailer product
                retailer_product = models.RetailerProduct(
                    retailer_id=request.retailer_id,
                    name=product.name,
                    price=product.price,
                    quantity=request.requested_quantity,
                    image_url=product.image_url
                )
                db.add(retailer_product)
                print(f"[INVENTORY] Created new retailer product entry")
            
            # Reduce warehouse stock
            product.quantity -= request.requested_quantity
        
        db.commit()
        db.refresh(request)
        print(f"[SUCCESS] Restock request updated from {old_status} to {request.status}")
        return request
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to update restock request: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")
@router.delete("/restock/{request_id}")
def delete_restock_request(request_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        request = db.query(models.RestockRequest).filter(
            models.RestockRequest.id == request_id,
            models.RestockRequest.retailer_id == current_user.get("id")
        ).first()
        if not request:
            raise HTTPException(status_code=404, detail="Request not found")
        db.delete(request)
        db.commit()
        return {"message": "Deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
