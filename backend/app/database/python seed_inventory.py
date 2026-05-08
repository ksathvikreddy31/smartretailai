import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.database.db import SessionLocal
from app.database.models import WarehouseProduct

db = SessionLocal()

products = [

    # ======================================
    # Consumer Electronics
    # ======================================

    WarehouseProduct(
        name="iPhone 15",
        price=79999,
        quantity=50,
        image_url="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
        category="Consumer Electronics"
    ),

    WarehouseProduct(
        name="Samsung Galaxy S24",
        price=74999,
        quantity=45,
        image_url="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1200&auto=format&fit=crop",
        category="Consumer Electronics"
    ),

    WarehouseProduct(
        name="Dell Inspiron Laptop",
        price=65999,
        quantity=30,
        image_url="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
        category="Consumer Electronics"
    ),

    WarehouseProduct(
        name="Sony Headphones",
        price=4999,
        quantity=80,
        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
        category="Consumer Electronics"
    ),

    WarehouseProduct(
        name="Boat Bluetooth Speaker",
        price=2999,
        quantity=120,
        image_url="https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1200&auto=format&fit=crop",
        category="Consumer Electronics"
    ),

    # ======================================
    # Fashion & Apparel
    # ======================================

    WarehouseProduct(
        name="Men Casual T-Shirt",
        price=799,
        quantity=200,
        image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
        category="Fashion & Apparel"
    ),

    WarehouseProduct(
        name="Women Denim Jacket",
        price=2499,
        quantity=90,
        image_url="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
        category="Fashion & Apparel"
    ),

    WarehouseProduct(
        name="Nike Running Shoes",
        price=4999,
        quantity=70,
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
        category="Fashion & Apparel"
    ),

    WarehouseProduct(
        name="Leather Wallet",
        price=999,
        quantity=150,
        image_url="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200&auto=format&fit=crop",
        category="Fashion & Apparel"
    ),

    WarehouseProduct(
        name="Smart Watch",
        price=3999,
        quantity=60,
        image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
        category="Fashion & Apparel"
    ),

    # ======================================
    # Health & Personal Care
    # ======================================

    WarehouseProduct(
        name="Face Wash",
        price=299,
        quantity=180,
        image_url="https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200&auto=format&fit=crop",
        category="Health & Personal Care"
    ),

    WarehouseProduct(
        name="Hair Oil",
        price=199,
        quantity=140,
        image_url="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
        category="Health & Personal Care"
    ),

    WarehouseProduct(
        name="Body Lotion",
        price=349,
        quantity=110,
        image_url="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop",
        category="Health & Personal Care"
    ),

    WarehouseProduct(
        name="Vitamin Tablets",
        price=599,
        quantity=95,
        image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop",
        category="Health & Personal Care"
    ),

    WarehouseProduct(
        name="Perfume Spray",
        price=1499,
        quantity=65,
        image_url="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
        category="Health & Personal Care"
    ),

    # ======================================
    # Home & Kitchen Essentials
    # ======================================

    WarehouseProduct(
        name="Mixer Grinder",
        price=3499,
        quantity=40,
        image_url="https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=1200&auto=format&fit=crop",
        category="Home & Kitchen Essentials"
    ),

    WarehouseProduct(
        name="Pressure Cooker",
        price=1999,
        quantity=75,
        image_url="https://images.unsplash.com/photo-1585515656973-4f2f4c7f3d3d?q=80&w=1200&auto=format&fit=crop",
        category="Home & Kitchen Essentials"
    ),

    WarehouseProduct(
        name="Non Stick Pan",
        price=899,
        quantity=130,
        image_url="https://images.unsplash.com/photo-1584990347449-ae89f124a6f5?q=80&w=1200&auto=format&fit=crop",
        category="Home & Kitchen Essentials"
    ),

    WarehouseProduct(
        name="Dining Table Set",
        price=15999,
        quantity=15,
        image_url="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        category="Home & Kitchen Essentials"
    ),

    WarehouseProduct(
        name="LED Bulb Pack",
        price=499,
        quantity=220,
        image_url="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
        category="Home & Kitchen Essentials"
    ),
]

try:

    # Optional: clear old inventory first
    # db.query(WarehouseProduct).delete()

    db.add_all(products)

    db.commit()

    print("Inventory products inserted successfully into Azure SQL!")

except Exception as e:

    db.rollback()

    print("ERROR:", e)

finally:

    db.close()