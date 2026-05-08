import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# =====================================================
# IMPORT YOUR SQLALCHEMY MODELS
# =====================================================

from models import (
    Base,
    AIProduct,
    Sale,
    ForecastPrediction
)

# =====================================================
# LOAD ENV VARIABLES
# =====================================================

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("❌ DATABASE_URL not found in .env file")

# =====================================================
# DATABASE CONNECTION
# =====================================================

try:
    engine = create_engine(DATABASE_URL)

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    session = SessionLocal()

    print("✅ Connected to Azure SQL Database")

except Exception as e:
    print("❌ Database connection failed")
    print(e)
    exit()

# =====================================================
# CREATE TABLES
# =====================================================

try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables verified/created")

except Exception as e:
    print("❌ Table creation failed")
    print(e)

# =====================================================
# CSV FILE PATHS
# =====================================================

PRODUCTS_CSV = r"C:\Users\ksath\smartretailsystem\products.csv"

SALES_CSV = r"C:\Users\ksath\smartretailsystem\sales.csv"

FORECAST_CSV = r"C:\Users\ksath\smartretailsystem\forecast_predictions.csv"

# =====================================================
# CHECK FILES EXIST
# =====================================================

csv_files = [
    PRODUCTS_CSV,
    SALES_CSV,
    FORECAST_CSV
]

for file_path in csv_files:

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"❌ CSV File not found:\n{file_path}"
        )

print("✅ All CSV files found")

# =====================================================
# LOAD CSV FILES
# =====================================================

try:

    products_df = pd.read_csv(PRODUCTS_CSV)

    sales_df = pd.read_csv(SALES_CSV)

    forecast_df = pd.read_csv(FORECAST_CSV)

    print("✅ CSV files loaded successfully")

except Exception as e:
    print("❌ Error reading CSV files")
    print(e)
    exit()

# =====================================================
# CLEAR EXISTING TABLE DATA
# =====================================================

try:

    session.query(Sale).delete()

    session.query(AIProduct).delete()

    session.query(ForecastPrediction).delete()

    session.commit()

    print("✅ Existing database records cleared")

except Exception as e:

    session.rollback()

    print("❌ Failed to clear old records")
    print(e)

# =====================================================
# INSERT PRODUCTS DATA
# =====================================================

try:

    for _, row in products_df.iterrows():

        product = AIProduct(
            product_id=int(row["product_id"]),
            category=str(row["category"]),
            product_name=str(row["product_name"]),
            price=float(row["price"]),
            stock=int(row["stock"])
        )

        session.add(product)

    session.commit()

    print(f"✅ {len(products_df)} product records inserted")

except Exception as e:

    session.rollback()

    print("❌ Product insertion failed")
    print(e)

# =====================================================
# INSERT SALES DATA
# =====================================================

try:

    for _, row in sales_df.iterrows():

        sale = Sale(
            sale_id=int(row["sale_id"]),
            date=pd.to_datetime(row["date"]).date(),
            product_id=int(row["product_id"]),
            category=str(row["category"]),
            product_name=str(row["product_name"]),
            quantity_sold=int(row["quantity_sold"]),
            price=float(row["price"]),
            revenue=float(row["revenue"]),
            warehouse=str(row["warehouse"]),
            supplier=str(row["supplier"]),
            discount=float(row["discount"]),
            customer_region=str(row["customer_region"])
        )

        session.add(sale)

    session.commit()

    print(f"✅ {len(sales_df)} sales records inserted")

except Exception as e:

    session.rollback()

    print("❌ Sales insertion failed")
    print(e)

# =====================================================
# INSERT FORECAST PREDICTIONS
# =====================================================

# =====================================================
# INSERT FORECAST PREDICTIONS
# =====================================================

try:

    # Rename CSV columns to match DB model
    forecast_df = forecast_df.rename(columns={
        "ds": "forecast_date",
        "yhat": "predicted_sales"
    })

    for _, row in forecast_df.iterrows():

        forecast = ForecastPrediction(

            forecast_date=pd.to_datetime(
                row["forecast_date"]
            ).date(),

            predicted_sales=float(
                row["predicted_sales"]
            )
        )

        session.add(forecast)

    session.commit()

    print(f"✅ {len(forecast_df)} forecast records inserted")

except Exception as e:

    session.rollback()

    print("❌ Forecast insertion failed")
    print(e)

# =====================================================
# CLOSE DATABASE SESSION
# =====================================================

session.close()

print("\n🎉 ALL CSV DATA SUCCESSFULLY INGESTED INTO AZURE SQL DATABASE")