from fastapi import APIRouter

from sqlalchemy.orm import Session

from fastapi import Depends

from app.utils.deps import get_db

from app.database.models import User

router = APIRouter()

# ==========================================
# GET RETAILERS
# ==========================================

@router.get("/retailers")
def get_retailers(

    db: Session = Depends(get_db)
):

    try:

        retailers = (

            db.query(User)

            .filter(
                User.role == "retail"
            )

            .all()
        )

        data = []

        for retailer in retailers:

            # ==========================
            # GENERATE NAME
            # ==========================

            email_name = (
                retailer.email
                .split("@")[0]
            )

            display_name = (
                email_name.capitalize()
                + " Retailer"
            )

            data.append({

                "id":
                retailer.id,

                "name":
                display_name,

                "email":
                retailer.email,

                "role":
                retailer.role,

                "status":
                retailer.status or "Active",

                "joined":
                retailer.created_at.strftime("%b %d, %Y") if retailer.created_at else "2026"
            })

        return {

            "success": True,

            "count": len(data),

            "retailers": data
        }

    except Exception as e:

        print(
            "ADMIN ROUTE ERROR:",
            e
        )

        return {

            "success": False,

            "message": str(e)
        }


# ==========================================
# DELETE RETAILER
# ==========================================

@router.delete("/retailers/{id}")
def delete_retailer(
    id: int,
    db: Session = Depends(get_db)
):
    try:
        from app.database import models
        
        retailer = db.query(models.User).filter(models.User.id == id, models.User.role == "retail").first()
        
        if not retailer:
            return {"success": False, "message": "Retailer not found"}

        # Manually delete related records to avoid FK constraints
        # 1. Retailer Products
        db.query(models.RetailerProduct).filter(models.RetailerProduct.retailer_id == id).delete()
        
        # 2. Orders (and OrderItems via cascade if set, but let's be safe)
        orders = db.query(models.Order).filter((models.Order.user_id == id) | (models.Order.retailer_id == id)).all()
        for order in orders:
            db.query(models.OrderItem).filter(models.OrderItem.order_id == order.id).delete()
            db.query(models.Payment).filter(models.Payment.order_id == order.id).delete()
            db.delete(order)
            
        # 3. Cart Items
        db.query(models.CartItem).filter(models.CartItem.user_id == id).delete()
        
        # 4. Restock Requests
        db.query(models.RestockRequest).filter(models.RestockRequest.retailer_id == id).delete()
        
        # 5. Messages
        db.query(models.Message).filter((models.Message.sender_id == id) | (models.Message.receiver_id == id)).delete()

        # Finally delete the retailer
        db.delete(retailer)
        db.commit()

        return {"success": True, "message": "Retailer and all related data deleted"}

    except Exception as e:
        db.rollback()
        print(f"DELETE ERROR: {str(e)}")
        return {"success": False, "message": str(e)}


# ==========================================
# TOGGLE RETAILER STATUS
# ==========================================

@router.put("/retailers/{id}")
def update_retailer_status(
    id: int,
    db: Session = Depends(get_db)
):
    try:
        retailer = db.query(User).filter(User.id == id, User.role == "retail").first()
        
        if not retailer:
            return {"success": False, "message": "Retailer not found"}

        # Toggle status
        if retailer.status == "Active":
            retailer.status = "Suspended"
        else:
            retailer.status = "Active"

        db.commit()

        return {"success": True, "message": f"Retailer status updated to {retailer.status}"}

    except Exception as e:
        db.rollback()
        return {"success": False, "message": str(e)}