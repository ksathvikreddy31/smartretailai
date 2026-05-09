import time
from datetime import date
from typing import List
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import models
from app.database.db import SessionLocal
from app.database.schemas import (
    CartItemCreate, CartItemUpdate, CartItemResponse,
    OrderResponse, PaymentResponse, CheckoutResponse, CheckoutRequest, PaymentMethod
)
from app.utils.deps import get_db, get_current_user

router = APIRouter()

# -------- CART ENDPOINTS --------

@router.get("/cart", response_model=List[CartItemResponse])
def get_cart(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    
    # Manually attach product details for convenience
    response = []
    for item in items:
        prod = item.product
        retailer = prod.retailer
        response.append(CartItemResponse(
            id=item.id,
            user_id=item.user_id,
            product_id=item.product_id,
            quantity=item.quantity,
            product_name=prod.name,
            product_price=prod.price,
            product_image_url=prod.image_url,
            retailer_id=prod.retailer_id,
            retailer_name=retailer.email.split("@")[0].capitalize() if retailer else "Unknown"
        ))
    return response

@router.post("/cart", response_model=CartItemResponse)
def add_to_cart(data: CartItemCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    
    # Check if item already in cart
    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == user_id,
        models.CartItem.product_id == data.product_id
    ).first()
    
    if existing:
        existing.quantity += data.quantity
        db.commit()
        db.refresh(existing)
        return existing
    
    new_item = models.CartItem(user_id=user_id, **data.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.patch("/cart/{item_id}", response_model=CartItemResponse)
def update_cart_item(item_id: int, data: CartItemUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.get("id")
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    item.quantity = data.quantity
    db.commit()
    db.refresh(item)
    return item

@router.delete("/cart/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.get("id")
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

# -------- PAYMENT PROCESSING --------
def validate_and_process_payment(payment_info: dict) -> tuple:
    """
    Validates and processes payment based on the selected method.
    Returns: (success: bool, message: str)
    """
    method = payment_info.get("method")
    
    if method == "Credit Card":
        # Validate card details
        card_number = payment_info.get("card_number", "").replace(" ", "")
        card_expiry = payment_info.get("card_expiry", "")
        card_cvv = payment_info.get("card_cvv", "")
        
        if not card_number or len(card_number) < 13:
            return False, "Invalid card number"
        if not card_expiry or len(card_expiry) < 5:
            return False, "Invalid expiry date (MM/YY)"
        if not card_cvv or len(card_cvv) < 3:
            return False, "Invalid CVV"
        
        # Mock payment processing - in production, integrate with Stripe/Razorpay
        return True, "Card payment processed successfully"
    
    elif method == "UPI":
        upi_id = payment_info.get("upi_id", "")
        if "@" not in upi_id or len(upi_id) < 5:
            return False, "Invalid UPI ID"
        
        # Mock UPI verification
        return True, "UPI payment initiated successfully"
    
    elif method == "QR Code":
        # Mock QR code payment verification
        return True, "QR code payment processed successfully"
    
    elif method == "Cash on Delivery":
        # CoD doesn't require upfront payment validation
        return True, "Cash on Delivery confirmed"
    
    else:
        return False, "Invalid payment method"

# -------- ORDER ENDPOINTS --------

def create_sale_record(order_item: models.OrderItem, order: models.Order) -> models.Sale:
    product = order_item.product
    revenue = round(order_item.quantity * order_item.price_at_purchase, 2)
    cost = round(revenue * 0.7, 2)

    return models.Sale(
        date=date.today(),
        store_id=str(order.retailer_id),
        product_id=str(product.id),
        category=product.category,
        product_name=product.name,
        quantity_sold=order_item.quantity,
        price=order_item.price_at_purchase,
        revenue=revenue,
        cost=cost,
        profit=round(revenue - cost, 2),
        stock_level=product.quantity,
        discount_pct=0,
        rolling_avg_7=order_item.quantity,
        rolling_avg_30=order_item.quantity,
        supplier=product.retailer.email if product.retailer else None,
    )

def sale_record_exists(order_item: models.OrderItem, order: models.Order, db: Session) -> bool:
    revenue = round(order_item.quantity * order_item.price_at_purchase, 2)

    return bool(
        db.query(models.Sale)
        .filter(
            models.Sale.store_id == str(order.retailer_id),
            models.Sale.product_id == str(order_item.product_id),
            models.Sale.quantity_sold == order_item.quantity,
            models.Sale.price == order_item.price_at_purchase,
            models.Sale.revenue == revenue,
        )
        .first()
    )

def create_sales_for_delivered_order(order: models.Order, db: Session) -> None:
    for item in order.items:
        if item.product and not sale_record_exists(item, order, db):
            db.add(create_sale_record(item, order))

def mark_payment_success(order: models.Order) -> None:
    if order.payment and order.payment.status != "Success":
        order.payment.status = "Success"

def complete_delivered_order(order: models.Order, db: Session) -> None:
    create_sales_for_delivered_order(order, db)
    mark_payment_success(order)
    order.status = "Delivered"

def mark_order_delivered_after_delay(order_id: int, delay_seconds: int = 5) -> None:
    time.sleep(delay_seconds)
    db = SessionLocal()
    try:
        order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if order and order.status == "Approved":
            complete_delivered_order(order, db)
            db.commit()
    finally:
        db.close()

def mark_delivered_payments_success(db: Session, **filters) -> None:
    query = db.query(models.Order).filter(models.Order.status == "Delivered")
    for field, value in filters.items():
        query = query.filter(getattr(models.Order, field) == value)

    delivered_orders = query.all()
    updated = False

    for order in delivered_orders:
        if order.payment and order.payment.status != "Success":
            order.payment.status = "Success"
            updated = True

    if updated:
        db.commit()

def mark_approved_orders_delivered(db: Session, **filters) -> None:
    query = db.query(models.Order).filter(models.Order.status == "Approved")
    for field, value in filters.items():
        query = query.filter(getattr(models.Order, field) == value)

    approved_orders = query.all()
    if not approved_orders:
        return

    for order in approved_orders:
        complete_delivered_order(order, db)
    db.commit()

@router.post("/checkout", response_model=CheckoutResponse)
def checkout(checkout_req: CheckoutRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Validate and process payment
    payment_info = checkout_req.payment_info.model_dump()
    payment_success, payment_message = validate_and_process_payment(payment_info)
    
    if not payment_success:
        raise HTTPException(status_code=400, detail=payment_message)
    
    # Group items by retailer
    retailer_groups = {}
    for item in cart_items:
        prod = item.product
        rid = prod.retailer_id
        if rid not in retailer_groups:
            retailer_groups[rid] = []
        retailer_groups[rid].append(item)
    
    order_ids = []
    total_amount = 0
    
    try:
        for rid, items in retailer_groups.items():
            # Calculate subtotal for this retailer
            subtotal = sum(item.quantity * item.product.price for item in items)
            tax = round(subtotal * 0.05, 2)
            total_for_retailer = subtotal + tax
            total_amount += total_for_retailer
            
            # Create Order - retailer must approve before stock is deducted.
            order = models.Order(
                user_id=user_id,
                retailer_id=rid,
                total_price=total_for_retailer,
                status="Pending Approval"
            )
            db.add(order)
            db.flush() # Get order ID
            
            # Create OrderItems
            for item in items:
                order_item = models.OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_purchase=item.product.price
                )
                db.add(order_item)
            
            # Create Payment Record
            payment_status = "Pending" if checkout_req.payment_info.method == "Cash on Delivery" else "Success"
            payment = models.Payment(
                order_id=order.id,
                user_id=user_id,
                retailer_id=rid,
                amount=total_for_retailer,
                status=payment_status,
                method=checkout_req.payment_info.method.value
            )
            db.add(payment)
            order_ids.append(order.id)
        
        # Clear Cart
        for item in cart_items:
            db.delete(item)
            
        db.commit()
        return {
            "message": "Payment successful! Orders split by retailer.",
            "order_ids": order_ids,
            "total_amount": total_amount
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    mark_approved_orders_delivered(db, user_id=user_id)
    mark_delivered_payments_success(db, user_id=user_id)
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).order_by(models.Order.created_at.desc()).all()
    return orders

@router.get("/retailer-orders", response_model=List[OrderResponse])
def get_retailer_orders(status: str = Query(None), db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    rid = current_user.get("id")
    if status != "Approved":
        mark_approved_orders_delivered(db, retailer_id=rid)
        mark_delivered_payments_success(db, retailer_id=rid)

    query = db.query(models.Order).filter(models.Order.retailer_id == rid)
    if status:
        if status == "pending":
            query = query.filter(
                models.Order.status.in_([
                    "Pending Approval",
                    "In Progress",
                    "Pending",
                ])
            )
        else:
            query = query.filter(models.Order.status == status)
    return query.order_by(models.Order.created_at.desc()).all()

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    background_tasks: BackgroundTasks,
    status: str = Query(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    rid = current_user.get("id")
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.retailer_id == rid
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or access denied")

    allowed_statuses = {
        "Pending Approval",
        "In Progress",
        "Approved",
        "Rejected",
        "Cancelled",
        "Completed",
        "Delivered",
    }

    if status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid order status")

    if status == "Approved" and order.status == "Pending Approval":
        for item in order.items:
            product = item.product

            if not product:
                raise HTTPException(status_code=400, detail="Order product not found")

            if product.quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}"
                )

        for item in order.items:
            item.product.quantity -= item.quantity
    
    if status == "Delivered":
        complete_delivered_order(order, db)
    else:
        order.status = status
    db.commit()
    db.refresh(order)

    if status == "Approved":
        background_tasks.add_task(mark_order_delivered_after_delay, order.id)

    return order
