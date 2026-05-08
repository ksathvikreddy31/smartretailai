import os
import sys
import joblib

# Add the parent directory to sys.path to allow importing from 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from prophet import Prophet
from sklearn.ensemble import IsolationForest

from app.database.db import SessionLocal
from preprocessing import (
    load_sales_data,
    get_unique_products,
    build_prophet_dataframe,
    build_anomaly_features,
)

MODEL_DIR = "ml/ml_models"

os.makedirs(MODEL_DIR, exist_ok=True)


# ==========================================
# FORECAST TRAINING
# ==========================================

def train_forecast_models(
    df,
    products
):

    models = {}

    for product_id in products:

        prophet_df = build_prophet_dataframe(
            df,
            product_id
        )

        if len(prophet_df) < 5:
            continue

        model = Prophet()

        model.fit(prophet_df)

        models[product_id] = model

        joblib.dump(
            model,
            f"{MODEL_DIR}/{product_id}_forecast.pkl"
        )

        print(
            f"Forecast trained: {product_id}"
        )

    return models


# ==========================================
# ANOMALY TRAINING
# ==========================================

def train_anomaly_models(
    df,
    products
):

    models = {}

    for product_id in products:

        feature_df = build_anomaly_features(
            df,
            product_id
        )

        features = [
            "quantity_sold",
            "revenue",
            "rolling_mean_7",
            "lag_1",
            "lag_7"
        ]

        X = feature_df[features]

        if len(X) < 5:
            continue

        model = IsolationForest(
            contamination=0.05,
            random_state=42
        )

        model.fit(X)

        models[product_id] = model

        joblib.dump(
            model,
            f"{MODEL_DIR}/{product_id}_anomaly.pkl"
        )

        print(
            f"Anomaly trained: {product_id}"
        )

    return models


# ==========================================
# MAIN TRAINING PIPELINE
# ==========================================

def run_training():

    db = SessionLocal()

    print("Loading sales data...")

    df = load_sales_data(db)

    if df.empty:

        print("No sales data found")

        return

    products = get_unique_products(df)

    print(
        f"Products Found: {products}"
    )

    print(
        "Training Forecast Models..."
    )

    train_forecast_models(
        df,
        products
    )

    print(
        "Training Anomaly Models..."
    )

    train_anomaly_models(
        df,
        products
    )

    print(
        "ML Training Completed"
    )


run_training()