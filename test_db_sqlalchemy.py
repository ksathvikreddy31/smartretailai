import sys
import os

from dotenv import load_dotenv
load_dotenv("backend/.env")

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from app.database.db import SessionLocal
from app.database import models

def test_db():
    db = SessionLocal()
    try:
        print("Fetching warehouse products...")
        products = db.query(models.WarehouseProduct).all()
        print(f"Found {len(products)} products.")
        for p in products:
            print(f"ID: {p.id}, Name: {p.name}")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_db()
