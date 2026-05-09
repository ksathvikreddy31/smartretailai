# drop_and_reseed.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import RetailerProduct
from dotenv import load_dotenv
import os

# Load env variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --------------------------------------------------
# PRODUCTS DATA
# --------------------------------------------------

products = [
    {
        "retailer_id": 1,
        "name": "Smartphone",
        "price": 2987,
        "quantity": 443,
        "category": "Consumer Electronics",
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
    },
    {
        "retailer_id": 1,
        "name": "Laptop",
        "price": 1439,
        "quantity": 138,
        "category": "Consumer Electronics",
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
    },
    {
        "retailer_id": 1,
        "name": "Bluetooth Speaker",
        "price": 2628,
        "quantity": 135,
        "category": "Consumer Electronics",
        "image_url": "https://images.unsplash.com/photo-1589003077984-894e133dabab"
    },
    {
        "retailer_id": 1,
        "name": "Smart Watch",
        "price": 2655,
        "quantity": 196,
        "category": "Consumer Electronics",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
        "retailer_id": 1,
        "name": "Wireless Earbuds",
        "price": 810,
        "quantity": 216,
        "category": "Consumer Electronics",
        "image_url": "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5"
    },
    {
        "retailer_id": 1,
        "name": "T-Shirt",
        "price": 4311,
        "quantity": 299,
        "category": "Fashion & Apparel",
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        "retailer_id": 1,
        "name": "Jeans",
        "price": 1965,
        "quantity": 239,
        "category": "Fashion & Apparel",
        "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
    },
    {
        "retailer_id": 1,
        "name": "Sneakers",
        "price": 4488,
        "quantity": 369,
        "category": "Fashion & Apparel",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        "retailer_id": 1,
        "name": "Jacket",
        "price": 1425,
        "quantity": 289,
        "category": "Fashion & Apparel",
        "image_url": "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504"
    },
    {
        "retailer_id": 1,
        "name": "Handbag",
        "price": 1951,
        "quantity": 367,
        "category": "Fashion & Apparel",
        "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
    },
    {
        "retailer_id": 1,
        "name": "Face Wash",
        "price": 3787,
        "quantity": 389,
        "category": "Health & Personal Care",
        "image_url": "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
    },
    {
        "retailer_id": 1,
        "name": "Shampoo",
        "price": 2620,
        "quantity": 235,
        "category": "Health & Personal Care",
        "image_url": "https://images.unsplash.com/photo-1526947425960-945c6e72858f"
    },
    {
        "retailer_id": 1,
        "name": "Protein Powder",
        "price": 266,
        "quantity": 450,
        "category": "Health & Personal Care",
        "image_url": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d"
    },
    {
        "retailer_id": 1,
        "name": "Toothpaste",
        "price": 4324,
        "quantity": 232,
        "category": "Health & Personal Care",
        "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2"
    },
    {
        "retailer_id": 1,
        "name": "Vitamin Tablets",
        "price": 4866,
        "quantity": 303,
        "category": "Health & Personal Care",
        "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88"
    },
    {
        "retailer_id": 1,
        "name": "Mixer Grinder",
        "price": 1936,
        "quantity": 457,
        "category": "Home & Kitchen Essentials",
        "image_url": "https://images.unsplash.com/photo-1570222094114-d054a817e56b"
    },
    {
        "retailer_id": 1,
        "name": "Cookware Set",
        "price": 2702,
        "quantity": 296,
        "category": "Home & Kitchen Essentials",
        "image_url": "https://images.unsplash.com/photo-1584990347449-ae5d9d2a06b4"
    },
    {
        "retailer_id": 1,
        "name": "Vacuum Cleaner",
        "price": 3217,
        "quantity": 114,
        "category": "Home & Kitchen Essentials",
        "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001"
    },
    {
        "retailer_id": 1,
        "name": "Water Bottle",
        "price": 3239,
        "quantity": 375,
        "category": "Home & Kitchen Essentials",
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8"
    },
    {
        "retailer_id": 1,
        "name": "Dining Set",
        "price": 4371,
        "quantity": 484,
        "category": "Home & Kitchen Essentials",
        "image_url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    }
]

# --------------------------------------------------
# DROP OLD DATA + INSERT NEW DATA
# --------------------------------------------------

def reseed_products():
    db = SessionLocal()

    try:
        # Delete old products for retailer_id = 1
        deleted = db.query(RetailerProduct).filter(
            RetailerProduct.retailer_id == 1
        ).delete()

        print(f"🗑️ Deleted {deleted} old products from retailer_id=1")

        # Insert new products for retailer_id = 1
        for product in products:

            new_product = RetailerProduct(
                retailer_id=product["retailer_id"],
                name=product["name"],
                price=product["price"],
                quantity=product["quantity"],
                category=product["category"],
                image_url=product["image_url"]
            )

            db.add(new_product)

        db.commit()

        print("✅ Products inserted successfully for retailer_id = 1")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")

    finally:
        db.close()

# --------------------------------------------------

if __name__ == "__main__":
    reseed_products()