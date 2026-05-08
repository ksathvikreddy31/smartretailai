from agent.retail_ml_agent.tools import (

    forecast_product,

    anomaly_check
)


# ==========================================
# PRODUCT MAP
# ==========================================

PRODUCT_MAP = {

    "smartphone": "CE100",

    "jeans": "FA202",

    "mixer grinder": "HK400",

    "electric toothbrush": "HP303"
}


# ==========================================
# GENERATE FORECAST
# ==========================================

def generate_forecast(product_name):

    product_name = product_name.lower()

    if product_name not in PRODUCT_MAP:

        return {

            "status": "error",

            "message": "Product not found"
        }

    product_id = PRODUCT_MAP[product_name]

    forecast = forecast_product(
        product_id
    )

    if forecast is None:

        return {

            "status": "error",

            "message": "Forecast model unavailable"
        }

    results = []

    for _, row in forecast.iterrows():

        results.append({

            "date": str(row["ds"]),

            "predicted_sales": round(
                row["yhat"],
                2
            )
        })

    return {

        "status": "success",

        "product": product_name,

        "forecast": results
    }


# ==========================================
# DETECT ANOMALIES
# ==========================================

def detect_anomalies(product_name):

    product_name = product_name.lower()

    if product_name not in PRODUCT_MAP:

        return {

            "status": "error",

            "message": "Product not found"
        }

    product_id = PRODUCT_MAP[product_name]

    result = anomaly_check(
        product_id
    )

    if result == -1:

        return {

            "status": "success",

            "anomaly": True,

            "message":
            "Anomaly detected in sales pattern"
        }

    return {

        "status": "success",

        "anomaly": False,

        "message":
        "Sales pattern looks normal"
    }


# ==========================================
# PROCESS CHAT QUERY
# ==========================================

def process_chat_query(

    message: str,

    role: str
):

    query = message.lower()

    # ======================================
    # FORECAST
    # ======================================
    if any(

        word in query

        for word in [

            "forecast",
            "predict",
            "future",
            "trend",
            "demand"
        ]
    ):

        for product in PRODUCT_MAP.keys():

            if product in query:

                return generate_forecast(
                    product
                )

        return {

            "status": "error",

            "message":
            "Please specify a product"
        }

    # ======================================
    # ANOMALY
    # ======================================
    if any(

        word in query

        for word in [

            "anomaly",
            "abnormal",
            "spike",
            "suspicious"
        ]
    ):

        for product in PRODUCT_MAP.keys():

            if product in query:

                return detect_anomalies(
                    product
                )

        return {

            "status": "error",

            "message":
            "Please specify a product"
        }

    return {

        "status": "success",

        "response":
        f"Retail ML Assistant analyzed: {message}"
    }