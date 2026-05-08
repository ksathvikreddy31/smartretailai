import os
import sys
import pandas as pd

# Add the parent directory to sys.path to allow importing from 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.models import Sale


# ==========================================
# LOAD SALES DATA
# ==========================================

def load_sales_data(db):

    sales = db.query(Sale).all()

    rows = []

    for sale in sales:

        rows.append({

            "sale_id": sale.sale_id,

            "date": sale.date,

            "store_id": sale.store_id,

            "product_id": sale.product_id,

            "category": sale.category,

            "product_name": sale.product_name,

            "quantity_sold": sale.quantity_sold,

            "price": sale.price,

            "revenue": sale.revenue,

            "cost": sale.cost,

            "profit": sale.profit,

            "stock_level": sale.stock_level,

            "discount_pct": sale.discount_pct,

            "rolling_avg_7": sale.rolling_avg_7,

            "rolling_avg_30": sale.rolling_avg_30,

            "warehouse": sale.warehouse,

            "supplier": sale.supplier,

            "customer_region": sale.customer_region,
        })

    df = pd.DataFrame(rows)

    if df.empty:
        return pd.DataFrame()

    df["date"] = pd.to_datetime(df["date"])

    return df


# ==========================================
# UNIQUE PRODUCTS
# ==========================================

def get_unique_products(df):

    return sorted(
        df["product_id"]
        .unique()
        .tolist()
    )


# ==========================================
# PROPHET DATAFRAME
# ==========================================

def build_prophet_dataframe(
    df,
    product_id
):

    product_df = df[
        df["product_id"] == product_id
    ].copy()

    product_df = product_df.rename(
        columns={
            "date": "ds",
            "quantity_sold": "y"
        }
    )

    return product_df[
        ["ds", "y"]
    ]


# ==========================================
# ANOMALY FEATURES
# ==========================================

def build_anomaly_features(
    df,
    product_id
):

    product_df = df[
        df["product_id"] == product_id
    ].copy()

    product_df = product_df.sort_values(
        "date"
    )

    # Rolling Mean
    product_df["rolling_mean_7"] = (
        product_df["quantity_sold"]
        .rolling(7)
        .mean()
    )

    # Lag Features
    product_df["lag_1"] = (
        product_df["quantity_sold"]
        .shift(1)
    )

    product_df["lag_7"] = (
        product_df["quantity_sold"]
        .shift(7)
    )

    product_df = product_df.fillna(0)

    return product_df