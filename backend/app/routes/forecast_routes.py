from fastapi import APIRouter

from agent.retail_ml_agent.tools import (
    forecast_product
)

router = APIRouter()

PRODUCTS = {

    "Smartphone": {
        "id": "CE100",
        "category":
        "Consumer Electronics",
        "stock": 443
    },

    "Jeans": {
        "id": "FA202",
        "category":
        "Fashion & Apparel",
        "stock": 239
    },

    "Mixer Grinder": {
        "id": "HK400",
        "category":
        "Home & Kitchen Essentials",
        "stock": 457
    },

    "Electric Toothbrush": {
        "id": "HP303",
        "category":
        "Health & Personal Care",
        "stock": 210
    }
}

@router.get("/forecast")
def get_forecast():

    results = []

    for product_name, details in PRODUCTS.items():

        forecast = forecast_product(
            details["id"]
        )

        if forecast is None:

            continue

        forecast_7 = round(

            forecast.tail(7)["yhat"]
            .sum(),

            2
        )

        forecast_30 = round(

            forecast.tail(30)["yhat"]
            .sum(),

            2
        )

        start = forecast.iloc[0]["yhat"]

        end = forecast.iloc[-1]["yhat"]

        trend = (
            "up"
            if end > start
            else "down"
        )

        results.append({

            "product": product_name,

            "category":
            details["category"],

            "current_stock":
            details["stock"],

            "forecast_7_days":
            forecast_7,

            "forecast_30_days":
            forecast_30,

            "trend": trend
        })

    results = sorted(

        results,

        key=lambda x:
        x["forecast_30_days"],

        reverse=True
    )

    return {

        "success": True,

        "forecast": results
    }