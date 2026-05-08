from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from sqlalchemy import func

from app.database.db import (
    SessionLocal
)

from app.database.models import (

    RetailerProduct,

    Sale
)

router = APIRouter()

# ======================================
# DB SESSION
# ======================================
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()

# ======================================
# RETAIL DASHBOARD
# ======================================
@router.get("/retail-dashboard")

def get_dashboard_data(

    retailer_id: int,

    db: Session = Depends(get_db)
):

    # ==================================
    # TOTAL PRODUCTS
    # ==================================
    total_products = (

        db.query(RetailerProduct)

        .filter(
            RetailerProduct.retailer_id
            == retailer_id
        )

        .count()
    )

    # ==================================
    # LOW STOCK ITEMS
    # ==================================
    low_stock_items = (

        db.query(RetailerProduct)

        .filter(
            RetailerProduct.retailer_id
            == retailer_id,

            RetailerProduct.quantity < 50
        )

        .count()
    )

    # ==================================
    # TODAY SALES
    # ==================================
    today_sales = (

        db.query(
            func.sum(Sale.revenue)
        )

        .scalar()
    )

    today_sales = (
        today_sales or 0
    )

    # ==================================
    # PENDING RESTOCKS
    # ==================================
    pending_restocks = (

        db.query(RetailerProduct)

        .filter(
            RetailerProduct.retailer_id
            == retailer_id,

            RetailerProduct.quantity < 20
        )

        .count()
    )

    # ==================================
    # STOCK ALERTS
    # ==================================
    low_stock_products = (

        db.query(RetailerProduct)

        .filter(
            RetailerProduct.retailer_id
            == retailer_id,

            RetailerProduct.quantity < 50
        )

        .all()
    )

    alerts = []

    for product in low_stock_products:

        severity = "info"

        if product.quantity < 10:

            severity = "critical"

        elif product.quantity < 25:

            severity = "warning"

        alerts.append({

            "product":
            product.name,

            "stock":
            product.quantity,

            "severity":
            severity
        })

    return {

        "total_products":
        total_products,

        "low_stock_items":
        low_stock_items,

        "today_sales":
        round(today_sales, 2),

        "pending_restocks":
        pending_restocks,

        "alerts":
        alerts
    }