import os
import joblib
import pandas as pd

MODEL_DIR = "ml/ml_models"


# ==========================================
# LOAD FORECAST MODEL
# ==========================================

def load_forecast_model(product_id):

    path = (
        f"{MODEL_DIR}/{product_id}_forecast.pkl"
    )

    if not os.path.exists(path):

        return None

    return joblib.load(path)


# ==========================================
# LOAD ANOMALY MODEL
# ==========================================

def load_anomaly_model(product_id):

    path = (
        f"{MODEL_DIR}/{product_id}_anomaly.pkl"
    )

    if not os.path.exists(path):

        return None

    return joblib.load(path)


# ==========================================
# FORECAST TOOL
# ==========================================

def forecast_product(product_id):

    model = load_forecast_model(
        product_id
    )

    if model is None:

        return None

    future = model.make_future_dataframe(
        periods=7
    )

    forecast = model.predict(future)

    result = forecast[
        ["ds", "yhat"]
    ].tail(7)

    return result


# ==========================================
# ANOMALY TOOL
# ==========================================

def anomaly_check(product_id):

    model = load_anomaly_model(
        product_id
    )

    if model is None:

        return None

    sample = pd.DataFrame([{

        "quantity_sold": 300,

        "revenue": 9000000,

        "rolling_mean_7": 40,

        "lag_1": 35,

        "lag_7": 38

    }])

    prediction = model.predict(sample)[0]

    return prediction