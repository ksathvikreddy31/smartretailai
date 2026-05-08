import os
import joblib

import pandas as pd

# ======================================
# LOAD MODEL
# ======================================
# Get the absolute path to the backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ml_models", "demand_forecast_model.pkl")

model = joblib.load(
    MODEL_PATH
)

print(
    "Demand Forecast Model Loaded"
)

# ======================================
# FORECAST SERVICE
# ======================================
class DemandForecastService:

    # ==================================
    # PREDICT DEMAND
    # ==================================
    def predict_demand(

        self,

        product_id,

        category,

        price,

        stock,

        discount,

        customer_region,

        month,

        day_of_week
    ):

        # --------------------------------
        # ENCODING MAPS
        # --------------------------------
        category_map = {

            "Consumer Electronics": 0,

            "Fashion": 1,

            "Home Appliances": 2,

            "Books": 3
        }

        region_map = {

            "North": 0,

            "South": 1,

            "East": 2,

            "West": 3
        }

        # --------------------------------
        # ENCODE VALUES
        # --------------------------------
        category_encoded = (

            category_map.get(
                category,
                0
            )
        )

        region_encoded = (

            region_map.get(
                customer_region,
                0
            )
        )

        # --------------------------------
        # CREATE INPUT DATAFRAME
        # --------------------------------
        input_data = pd.DataFrame([{

            "product_id":
            product_id,

            "category":
            category_encoded,

            "price":
            price,

            "stock":
            stock,

            "discount":
            discount,

            "customer_region":
            region_encoded,

            "month":
            month,

            "day_of_week":
            day_of_week
        }])

        # --------------------------------
        # PREDICT
        # --------------------------------
        prediction = model.predict(
            input_data
        )[0]

        # --------------------------------
        # STOCK ANALYSIS
        # --------------------------------
        if stock < prediction:

            stock_status = (
                "Restocking Required"
            )

        elif stock < 50:

            stock_status = (
                "Low Stock"
            )

        else:

            stock_status = (
                "Stock Healthy"
            )

        # --------------------------------
        # RETURN RESULT
        # --------------------------------
        return {

            "predicted_demand":
            round(float(prediction), 2),

            "current_stock":
            stock,

            "stock_status":
            stock_status
        }