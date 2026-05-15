
import os
import joblib
import pandas as pd
from prophet import Prophet

# =========================
# BASE DIRECTORY
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# =========================
# FILE PATHS
# =========================
MODEL_PATH = os.path.normpath(
    os.path.join(
        BASE_DIR,
        "../../../ai-layer/forecasting/forecast_model.pkl"
    )
)

PRODUCTS_CSV = os.path.normpath(
    os.path.join(
        BASE_DIR,
        "../../../products.csv"
    )
)

SALES_CSV = os.path.normpath(
    os.path.join(
        BASE_DIR,
        "../../../sales.csv"
    )
)

# =========================
# LOAD TRAINED MODEL
# =========================
print(f"\nLoading model from: {MODEL_PATH}")

try:
    model = joblib.load(MODEL_PATH)
    print("Demand Forecast Model Loaded Successfully")

except Exception as e:
    print(f"Error loading model: {e}")
    model = None


# =========================
# DEMAND FORECAST FUNCTION
# =========================
def predict_demand(days=30):

    """
    Generate future demand forecasts
    using Prophet forecasting model.
    """

    if model is None:

        print("Forecast model is not loaded")

        return {
            "success": False,
            "message": "Forecast model not loaded."
        }

    try:

        # =========================
        # LOAD DATASETS
        # =========================
        print("\nLoading datasets...")

        products_df = pd.read_csv(PRODUCTS_CSV)
        sales_df = pd.read_csv(SALES_CSV)

        print(f"Products Loaded: {len(products_df)}")
        print(f"Sales Records Loaded: {len(sales_df)}")

        # =========================
        # VALIDATE REQUIRED COLUMNS
        # =========================
        required_product_cols = [
            "product_id",
            "product_name",
            "category",
            "stock"
        ]

        required_sales_cols = [
            "product_id",
            "quantity_sold"
        ]

        for col in required_product_cols:

            if col not in products_df.columns:
                return {
                    "success": False,
                    "message": f"Missing column in products.csv: {col}"
                }

        for col in required_sales_cols:

            if col not in sales_df.columns:
                return {
                    "success": False,
                    "message": f"Missing column in sales.csv: {col}"
                }

        # =========================
        # CALCULATE PRODUCT WEIGHTS
        # =========================
        print("\nCalculating product demand weights...")

        total_sales_quantity = sales_df["quantity_sold"].sum()

        if total_sales_quantity <= 0:

            return {
                "success": False,
                "message": "Total sales quantity is zero."
            }

        product_weights = (
            sales_df
            .groupby("product_id")["quantity_sold"]
            .sum() / total_sales_quantity
        )

        product_weights = product_weights.to_dict()

        # =========================
        # GENERATE FUTURE FORECAST
        # =========================
        print("\nGenerating future forecast...")

        future = model.make_future_dataframe(
            periods=days
        )

        forecast = model.predict(future)

        # =========================
        # FUTURE FORECAST ONLY
        # =========================
        future_forecast = forecast.tail(days)

        # =========================
        # CLIP NEGATIVE VALUES
        # =========================
        future_forecast["yhat"] = (
            future_forecast["yhat"]
            .clip(lower=0)
        )

        # =========================
        # TOTAL FORECASTS
        # =========================
        total_7_days = (
            future_forecast
            .head(7)["yhat"]
            .sum()
        )

        total_30_days = (
            future_forecast["yhat"]
            .sum()
        )

        # =========================
        # TREND ANALYSIS
        # =========================
        historical_last_7 = (
            forecast
            .iloc[-(days + 7):-days]["yhat"]
            .sum()
        )

        overall_trend = (
            "up"
            if total_7_days > historical_last_7
            else "down"
        )

        print(f"\nTrend Detected: {overall_trend}")

        # =========================
        # GENERATE PRODUCT FORECASTS
        # =========================
        results = []

        for _, product in products_df.iterrows():

            pid = product["product_id"]

            weight = product_weights.get(pid, 0.0)

            # =========================
            # DISTRIBUTED FORECASTS
            # =========================
            forecast_7 = max(
                0,
                round(total_7_days * weight)
            )

            forecast_30 = max(
                0,
                round(total_30_days * weight)
            )

            current_stock = int(product["stock"])

            # =========================
            # STOCK STATUS
            # =========================
            if current_stock < forecast_7:

                stock_status = "Critical Stock"

                recommendation = (
                    "Immediate restocking recommended."
                )

            elif current_stock < forecast_30:

                stock_status = "Low Stock"

                recommendation = (
                    "Consider restocking soon."
                )

            else:

                stock_status = "Stock Healthy"

                recommendation = (
                    "Current inventory is sufficient."
                )

            # =========================
            # PRODUCT RESULT
            # =========================
            results.append({

                "product": product["product_name"],

                "category": product["category"],

                "current_stock": current_stock,

                "forecast_7_days": int(forecast_7),

                "forecast_30_days": int(forecast_30),

                "trend": overall_trend,

                "stock_status": stock_status,

                "recommendation": recommendation
            })

        # =========================
        # SORT BY DEMAND
        # =========================
        results.sort(
            key=lambda x: x["forecast_30_days"],
            reverse=True
        )

        # =========================
        # RETURN TOP 5 PRODUCTS
        # =========================
        final_results = results[:5]

        print("\nForecast generation completed successfully.")

        return {
            "success": True,
            "forecast_days": days,
            "total_products": len(final_results),
            "results": final_results
        }

    except Exception as e:

        print(f"\nException in predict_demand: {e}")

        return {
            "success": False,
            "message": str(e)
        }