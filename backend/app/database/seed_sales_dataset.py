import sys
import os

# Add the backend directory to sys.path to resolve 'app' module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pandas as pd
from sqlalchemy.orm import Session
from app.database.db import SessionLocal, engine
from app.database import models
from datetime import datetime

# =====================================================
# CONFIGURATION
# =====================================================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CSV_PATH = os.path.join(BASE_DIR, "csvfiles", "retail_project_training_dataset.csv")

def seed_sales():
    """
    Seeds the 'sales' table using the retail_project_training_dataset.csv file.
    Clears existing data in the sales table before inserting.
    """
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV file not found at {CSV_PATH}")
        return

    print(f"Reading data from {CSV_PATH}...")
    try:
        df = pd.read_csv(CSV_PATH)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    db: Session = SessionLocal()
    try:
        print("Clearing existing sales data...")
        db.query(models.Sale).delete()
        db.commit()

        print(f"Inserting {len(df)} records into 'sales' table...")
        
        sales_to_insert = []
        for index, row in df.iterrows():
            # Create Sale object mapping CSV columns to model columns
            sale = models.Sale(
                date=pd.to_datetime(row["date"]).date(),
                product_id=str(row["product_id"]),
                product_name=str(row["product_name"]),
                category=str(row["category"]),
                store_id=str(row["store_id"]),
                quantity_sold=int(row["quantity_sold"]),
                price=float(row["price"]),
                revenue=float(row["revenue"]),
                cost=float(row["cost"]),
                profit=float(row["profit"]),
                stock_level=int(row["stock_level"]),
                discount_pct=float(row["discount_pct"]),
                rolling_avg_7=float(row["rolling_avg_7"]),
                rolling_avg_30=float(row["rolling_avg_30"])
                # Note: warehouse, supplier, customer_region are optional and not in this CSV
            )
            sales_to_insert.append(sale)
            
            # Batch commit every 100 records for efficiency
            if len(sales_to_insert) >= 100:
                db.add_all(sales_to_insert)
                db.commit()
                sales_to_insert = []

        # Insert remaining records
        if sales_to_insert:
            db.add_all(sales_to_insert)
            db.commit()

        print("Sales data seeded successfully!")

    except Exception as e:
        db.rollback()
        print("Error during seeding: " + str(e))
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables are created
    models.Base.metadata.create_all(bind=engine)
    seed_sales()
