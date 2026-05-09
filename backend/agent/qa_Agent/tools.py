# from sqlalchemy.orm import Session

# from app.database.db import SessionLocal

# from app.database.models import (
#     Order,
#     Payment,
#     AIProduct
# )

# # ==========================================
# # CUSTOMER ORDERS
# # ==========================================
# def get_customer_orders(customer_id: int):

#     db: Session = SessionLocal()

#     try:

#         orders = (
#             db.query(Order)
#             .filter(Order.user_id == customer_id)
#             .all()
#         )

#         if not orders:
#             return "No orders found."

#         response = []

#         for order in orders:

#             response.append({
#                 "order_id": order.id,
#                 "status": order.status,
#                 "total_price": order.total_price
#             })

#         return response

#     finally:
#         db.close()

# # ==========================================
# # PAYMENT STATUS
# # ==========================================
# def get_payment_status(customer_id: int):

#     db: Session = SessionLocal()

#     try:

#         payments = (
#             db.query(Payment)
#             .filter(Payment.user_id == customer_id)
#             .all()
#         )

#         if not payments:
#             return "No payment history found."

#         response = []

#         for payment in payments:

#             response.append({
#                 "payment_id": payment.id,
#                 "amount": payment.amount,
#                 "status": payment.status,
#                 "method": payment.method
#             })

#         return response

#     finally:
#         db.close()

# # ==========================================
# # PRODUCT SEARCH
# # ==========================================
# def search_product(query: str):

#     db: Session = SessionLocal()

#     try:

#         product = (
#             db.query(AIProduct)
#             .filter(
#                 AIProduct.product_name.ilike(
#                     f"%{query}%"
#                 )
#             )
#             .first()
#         )

#         if not product:
#             return "Product not found."

#         return {
#             "product_name": product.product_name,
#             "category": product.category,
#             "price": product.price,
#             "stock": product.stock
#         }

#     finally:
# #         db.close()
# from difflib import get_close_matches

# from sqlalchemy import or_
# from sqlalchemy.orm import Session

# from app.database.db import SessionLocal

# from app.database.models import (
#     Order,
#     OrderItem,
#     Payment,
#     AIProduct,
#     CartItem,
#     RetailerProduct,
# )


# # ==========================================
# # PRODUCT KEYWORDS FOR FUZZY MATCHING
# # These match names in AIProduct (products table)
# # and RetailerProduct (retailer_products table).
# # Add new product names here as catalog grows.
# # ==========================================
# ALL_PRODUCT_NAMES = [
#     "smartphone",
#     "laptop",
#     "bluetooth speaker",
#     "smart watch",
#     "smartwatch",
#     "electric toothbrush",
#     "mixer grinder",
#     "headphones",
#     "tablet",
#     "television",
#     "refrigerator",
#     "washing machine",
#     "jeans",
#     "shirt",
#     "shoes",
#     "watch",
#     "tv",
#     "speaker",
#     "earphones",
#     "earbuds",
# ]

# CATEGORY_ALIASES = {
#     "electronics": "Consumer Electronics",
#     "electronic": "Consumer Electronics",
#     "consumer electronics": "Consumer Electronics",
#     "fashion": "Fashion & Apparel",
#     "apparel": "Fashion & Apparel",
#     "clothes": "Fashion & Apparel",
#     "clothing": "Fashion & Apparel",
#     "home": "Home & Kitchen Essentials",
#     "kitchen": "Home & Kitchen Essentials",
#     "home kitchen": "Home & Kitchen Essentials",
#     "health": "Health & Personal Care",
#     "personal care": "Health & Personal Care",
# }


# # ==========================================
# # FUZZY MATCH HELPER
# # Handles spelling mistakes like:
# #   "smartfone"  -> "smartphone"
# #   "lapotop"    -> "laptop"
# #   "spekear"    -> "speaker"
# # ==========================================
# def fuzzy_match_product(query: str) -> str:

#     query_lower = query.lower().strip()

#     # 1. Exact substring match (longest keyword wins)
#     for name in sorted(ALL_PRODUCT_NAMES, key=len, reverse=True):
#         if name in query_lower:
#             return name

#     # 2. Fuzzy match on each word in the query
#     words = query_lower.split()
#     for word in words:
#         matches = get_close_matches(
#             word,
#             ALL_PRODUCT_NAMES,
#             n=1,
#             cutoff=0.72
#         )
#         if matches:
#             return matches[0]

#     # 3. Fuzzy match on the full query string
#     matches = get_close_matches(
#         query_lower,
#         ALL_PRODUCT_NAMES,
#         n=1,
#         cutoff=0.60
#     )
#     if matches:
#         return matches[0]

#     # 4. Fallback
#     return query_lower


# def match_category(query: str):
#     query_lower = query.lower().strip()

#     for alias, category in CATEGORY_ALIASES.items():
#         if alias in query_lower:
#             return category

#     return None


# # ==========================================
# # CART CONTENTS
# # CartItem is directly linked to user_id —
# # there is no separate Cart table in models.
# # CartItem.product → RetailerProduct
# # ==========================================
# def get_cart_contents(customer_id: int):

#     db: Session = SessionLocal()

#     try:

#         items = (
#             db.query(CartItem)
#             .filter(CartItem.user_id == customer_id)
#             .all()
#         )

#         if not items:
#             return "Your cart is currently empty."

#         result = []
#         total = 0.0

#         for item in items:

#             product = item.product  # RetailerProduct

#             product_name = (
#                 product.name if product else "Unknown Product"
#             )

#             price = float(product.price or 0) if product else 0.0

#             subtotal = price * item.quantity
#             total += subtotal

#             result.append({
#                 "product": product_name,
#                 "category": product.category if product else "N/A",
#                 "quantity": item.quantity,
#                 "price_each": price,
#                 "subtotal": round(subtotal, 2),
#             })

#         return {
#             "items": result,
#             "total_items": sum(i["quantity"] for i in result),
#             "cart_total": round(total, 2),
#         }

#     finally:
#         db.close()


# # ==========================================
# # CUSTOMER ORDERS
# # Order.items → OrderItem → RetailerProduct
# # OrderItem uses price_at_purchase (not price)
# # ==========================================
# def get_customer_orders(customer_id: int):

#     db: Session = SessionLocal()

#     try:

#         orders = (
#             db.query(Order)
#             .filter(Order.user_id == customer_id)
#             .all()
#         )

#         if not orders:
#             return "You have no orders yet."

#         result = []

#         for order in orders:

#             item_list = [
#                 {
#                     "product": (
#                         item.product.name
#                         if item.product else "Unknown"
#                     ),
#                     "quantity": item.quantity,
#                     "price_at_purchase": float(
#                         item.price_at_purchase or 0
#                     ),
#                 }
#                 for item in order.items
#             ]

#             result.append({
#                 "order_id": order.id,
#                 "status": order.status,
#                 "total_price": float(order.total_price or 0),
#                 "placed_on": str(order.created_at)[:10],
#                 "items": item_list,
#             })

#         return result

#     finally:
#         db.close()


# # ==========================================
# # PAYMENT STATUS
# # ==========================================
# def get_payment_status(customer_id: int):

#     db: Session = SessionLocal()

#     try:

#         payments = (
#             db.query(Payment)
#             .filter(Payment.user_id == customer_id)
#             .all()
#         )

#         if not payments:
#             return "No payment history found for your account."

#         return [
#             {
#                 "payment_id": payment.id,
#                 "amount": float(payment.amount or 0),
#                 "status": payment.status,
#                 "method": payment.method,
#                 "date": str(payment.timestamp)[:10],
#             }
#             for payment in payments
#         ]

#     finally:
#         db.close()


# # ==========================================
# # PRODUCT SEARCH
# # Searches the live retailer catalog first.
# # Category requests like "electronics products"
# # are matched against RetailerProduct.category.
# # Falls back to AIProduct only if that table has data.
# # ==========================================
# def search_product(query: str):

#     db: Session = SessionLocal()

#     try:

#         category = match_category(query)
#         search_term = fuzzy_match_product(query)

#         retailer_query = db.query(RetailerProduct)

#         if category:
#             retailer_products = (
#                 retailer_query
#                 .filter(RetailerProduct.category == category)
#                 .all()
#             )
#         else:
#             retailer_products = (
#                 retailer_query
#                 .filter(
#                     or_(
#                         RetailerProduct.name.ilike(f"%{search_term}%"),
#                         RetailerProduct.category.ilike(f"%{search_term}%"),
#                     )
#                 )
#                 .all()
#             )

#         if retailer_products:
#             return [
#                 {
#                     "product_name": p.name,
#                     "category": p.category,
#                     "price": float(p.price or 0),
#                     "stock": p.quantity,
#                     "available": (p.quantity or 0) > 0,
#                     "retailer_id": p.retailer_id,
#                 }
#                 for p in retailer_products
#             ]

#         products = (
#             db.query(AIProduct)
#             .filter(
#                 or_(
#                     AIProduct.product_name.ilike(f"%{search_term}%"),
#                     AIProduct.category.ilike(f"%{category or search_term}%"),
#                 )
#             )
#             .all()
#         )

#         if not products:
#             return (
#                 f"No products found matching '{query}'. "
#                 f"Try browsing by category: Electronics, "
#                 f"Fashion, Home & Kitchen, Health."
#             )

#         return [
#             {
#                 "product_name": p.product_name,
#                 "category": p.category,
#                 "price": float(p.price or 0),
#                 "stock": p.stock,
#                 "available": (p.stock or 0) > 0,
#             }
#             for p in products
#         ]

#     finally:
#         db.close()
from difflib import get_close_matches

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database.db import SessionLocal

from app.database.models import (
    Order,
    Payment,
    AIProduct,
    CartItem,
    RetailerProduct,
)


# ==========================================
# CATEGORY ALIASES
# ==========================================
CATEGORY_ALIASES = {

    "electronics": "Consumer Electronics",
    "electronic": "Consumer Electronics",
    "consumer electronics": "Consumer Electronics",

    "fashion": "Fashion & Apparel",
    "apparel": "Fashion & Apparel",
    "clothes": "Fashion & Apparel",
    "clothing": "Fashion & Apparel",

    "home": "Home & Kitchen Essentials",
    "kitchen": "Home & Kitchen Essentials",
    "home kitchen": "Home & Kitchen Essentials",

    "health": "Health & Personal Care",
    "personal care": "Health & Personal Care",
}


# ==========================================
# CATEGORY MATCH
# ==========================================
def match_category(query: str):

    query_lower = query.lower().strip()

    for alias, category in CATEGORY_ALIASES.items():

        if alias in query_lower:
            return category

    return None


# ==========================================
# DYNAMIC FUZZY PRODUCT MATCH
# Uses live DB product names
# ==========================================
def fuzzy_match_product(query: str):

    db: Session = SessionLocal()

    try:

        query_lower = query.lower().strip()

        products = (
            db.query(RetailerProduct.name)
            .all()
        )

        product_names = [
            p[0].lower()
            for p in products
            if p[0]
        ]

        # --------------------------------------
        # Exact substring match
        # --------------------------------------
        for name in sorted(
            product_names,
            key=len,
            reverse=True
        ):

            if name in query_lower:
                return name

        # --------------------------------------
        # Fuzzy word matching
        # --------------------------------------
        words = query_lower.split()

        for word in words:

            matches = get_close_matches(
                word,
                product_names,
                n=1,
                cutoff=0.72
            )

            if matches:
                return matches[0]

        # --------------------------------------
        # Full query fuzzy match
        # --------------------------------------
        matches = get_close_matches(
            query_lower,
            product_names,
            n=1,
            cutoff=0.60
        )

        if matches:
            return matches[0]

        return ""

    finally:

        db.close()


# ==========================================
# CART CONTENTS
# ==========================================
def get_cart_contents(customer_id: int):

    db: Session = SessionLocal()

    try:

        items = (
            db.query(CartItem)
            .filter(CartItem.user_id == customer_id)
            .all()
        )

        if not items:
            return "Your cart is currently empty."

        result = []

        total = 0.0

        for item in items:

            product = item.product

            product_name = (
                product.name
                if product else "Unknown Product"
            )

            price = (
                float(product.price or 0)
                if product else 0.0
            )

            subtotal = price * item.quantity

            total += subtotal

            result.append({

                "product": product_name,

                "category": (
                    product.category
                    if product else "N/A"
                ),

                "quantity": item.quantity,

                "price_each": price,

                "subtotal": round(subtotal, 2),
            })

        return {

            "items": result,

            "total_items": sum(
                i["quantity"] for i in result
            ),

            "cart_total": round(total, 2),
        }

    finally:

        db.close()


# ==========================================
# CUSTOMER ORDERS
# ==========================================
def get_customer_orders(customer_id: int):

    db: Session = SessionLocal()

    try:

        orders = (
            db.query(Order)
            .filter(Order.user_id == customer_id)
            .all()
        )

        if not orders:
            return "You have no orders yet."

        result = []

        for order in orders:

            item_list = [

                {
                    "product": (
                        item.product.name
                        if item.product else "Unknown"
                    ),

                    "quantity": item.quantity,

                    "price_at_purchase": float(
                        item.price_at_purchase or 0
                    ),
                }

                for item in order.items
            ]

            result.append({

                "order_id": order.id,

                "status": order.status,

                "total_price": float(
                    order.total_price or 0
                ),

                "placed_on": str(
                    order.created_at
                )[:10],

                "items": item_list,
            })

        return result

    finally:

        db.close()


# ==========================================
# PAYMENT STATUS
# ==========================================
def get_payment_status(customer_id: int):

    db: Session = SessionLocal()

    try:

        payments = (
            db.query(Payment)
            .filter(Payment.user_id == customer_id)
            .all()
        )

        if not payments:
            return (
                "No payment history found "
                "for your account."
            )

        return [

            {
                "payment_id": payment.id,

                "amount": float(
                    payment.amount or 0
                ),

                "status": payment.status,

                "method": payment.method,

                "date": str(
                    payment.timestamp
                )[:10],
            }

            for payment in payments
        ]

    finally:

        db.close()


# ==========================================
# PRODUCT SEARCH
# ==========================================
def search_product(query: str):

    db: Session = SessionLocal()

    try:

        query_lower = query.lower()

        category = match_category(query)

        search_term = fuzzy_match_product(query)

        # ======================================
        # GENERIC PRODUCT QUERIES
        # ======================================
        GENERIC_PRODUCT_QUERIES = [

            "product",
            "products",
            "shop",
            "store",
            "available",
            "items",
            "catalog",
            "show me",
            "what do you sell",
            "what products",
        ]

        # ======================================
        # SHOW ALL PRODUCTS
        # ======================================
        if (

            any(
                word in query_lower
                for word in GENERIC_PRODUCT_QUERIES
            )

            and not category
            and not search_term
        ):

            retailer_products = (

                db.query(RetailerProduct)
                .limit(20)
                .all()
            )

        # ======================================
        # CATEGORY SEARCH
        # ======================================
        elif category:

            retailer_products = (

                db.query(RetailerProduct)

                .filter(
                    RetailerProduct.category == category
                )

                .all()
            )

        # ======================================
        # PRODUCT SEARCH
        # ======================================
        elif search_term:

            retailer_products = (

                db.query(RetailerProduct)

                .filter(

                    or_(

                        RetailerProduct.name.ilike(
                            f"%{search_term}%"
                        ),

                        RetailerProduct.category.ilike(
                            f"%{search_term}%"
                        ),
                    )
                )

                .all()
            )

        # ======================================
        # DIRECT QUERY SEARCH
        # ======================================
        else:

            retailer_products = (

                db.query(RetailerProduct)

                .filter(

                    or_(

                        RetailerProduct.name.ilike(
                            f"%{query}%"
                        ),

                        RetailerProduct.category.ilike(
                            f"%{query}%"
                        ),
                    )
                )

                .limit(20)

                .all()
            )

        # ======================================
        # RETURN RETAILER PRODUCTS
        # ======================================
        if retailer_products:

            return [

                {
                    "product_name": p.name,

                    "category": p.category,

                    "price": float(
                        p.price or 0
                    ),

                    "stock": p.quantity,

                    "available": (
                        (p.quantity or 0) > 0
                    ),

                    "retailer_id": p.retailer_id,
                }

                for p in retailer_products
            ]

        # ======================================
        # FALLBACK TO AI PRODUCTS
        # ======================================
        products = (

            db.query(AIProduct)

            .filter(

                or_(

                    AIProduct.product_name.ilike(
                        f"%{query}%"
                    ),

                    AIProduct.category.ilike(
                        f"%{query}%"
                    ),
                )
            )

            .all()
        )

        if products:

            return [

                {
                    "product_name": p.product_name,

                    "category": p.category,

                    "price": float(
                        p.price or 0
                    ),

                    "stock": p.stock,

                    "available": (
                        (p.stock or 0) > 0
                    ),
                }

                for p in products
            ]

        return (
            f"No products found matching '{query}'. "
            f"Try categories like Electronics, "
            f"Fashion, Home & Kitchen, Health."
        )

    finally:

        db.close()