# from app.services.demand_forecast_service import (
#     DemandForecastService
# )

# # ======================================
# # FORECAST SERVICE
# # ======================================
# forecast_service = (
#     DemandForecastService()
# )

# # ======================================
# # FORECAST DEMAND
# # ======================================
# def forecast_demand(payload):

#     result = (

#         forecast_service
#         .predict_demand(

#             product_id=
#             payload["product_id"],

#             category=
#             payload["category"],

#             price=
#             payload["price"],

#             stock=
#             payload["stock"],

#             discount=
#             payload["discount"],

#             customer_region=
#             payload["customer_region"],

#             month=
#             payload["month"],

#             day_of_week=
#             payload["day_of_week"]
#         )
#     )

#     return result

# # ======================================
# # RESTOCK RECOMMENDATION
# # ======================================
# def generate_restock_recommendation(

#     current_stock,

#     predicted_demand
# ):

#     # ----------------------------------
#     # HIGH DEMAND
#     # ----------------------------------
#     if predicted_demand > current_stock:

#         shortage = (

#             predicted_demand
#             - current_stock
#         )

#         return f"""

#         Restock Required.

#         Expected shortage:
#         {round(shortage, 2)} units.

#         """

#     # ----------------------------------
#     # LOW STOCK
#     # ----------------------------------
#     if current_stock < 50:

#         return """

#         Stock is low.

#         Consider restocking soon.

#         """

#     # ----------------------------------
#     # STOCK HEALTHY
#     # ----------------------------------
#     return """

#     Current inventory is healthy.

#     No immediate restocking required.

#     """


from app.services.demand_forecast_service import (
    DemandForecastService
)

# ======================================
# FORECAST SERVICE
# ======================================
forecast_service = (
    DemandForecastService()
)

# ======================================
# FORECAST DEMAND
# ======================================
def forecast_demand(payload):

    result = (

        forecast_service
        .predict_demand(

            product_id=
            payload["product_id"],

            category=
            payload["category"],

            price=
            payload["price"],

            stock=
            payload["stock"],

            discount=
            payload["discount"],

            customer_region=
            payload["customer_region"],

            month=
            payload["month"],

            day_of_week=
            payload["day_of_week"]
        )
    )

    # ==================================
    # CLEAN PREDICTION
    # ==================================
    predicted_demand = float(

        result["predicted_demand"]
    )

    # ----------------------------------
    # PREVENT NEGATIVE VALUES
    # ----------------------------------
    predicted_demand = max(

        0,

        round(predicted_demand, 2)
    )

    # ==================================
    # CURRENT STOCK
    # ==================================
    current_stock = int(
        result["current_stock"]
    )

    # ==================================
    # STOCK STATUS
    # ==================================
    if predicted_demand >= current_stock:

        stock_status = (
            "Critical Stock"
        )

    elif predicted_demand >= (
        current_stock * 0.7
    ):

        stock_status = (
            "Low Stock"
        )

    elif predicted_demand >= (
        current_stock * 0.4
    ):

        stock_status = (
            "Medium Stock"
        )

    else:

        stock_status = (
            "Stock Healthy"
        )

    # ==================================
    # RETURN CLEANED RESULT
    # ==================================
    return {

        "predicted_demand":
        predicted_demand,

        "current_stock":
        current_stock,

        "stock_status":
        stock_status
    }

# ======================================
# RESTOCK RECOMMENDATION
# ======================================
def generate_restock_recommendation(

    current_stock,

    predicted_demand
):

    # ==================================
    # CRITICAL STOCK
    # ==================================
    if predicted_demand >= current_stock:

        shortage = (

            predicted_demand
            - current_stock
        )

        return f"""

        Urgent Restock Required.

        Expected shortage:
        {round(shortage, 2)} units.

        Demand is likely to exceed
        current inventory.

        """

    # ==================================
    # LOW STOCK
    # ==================================
    elif predicted_demand >= (
        current_stock * 0.7
    ):

        return """

        Inventory levels may become low.

        Consider restocking soon
        to avoid future shortages.

        """

    # ==================================
    # MEDIUM STOCK
    # ==================================
    elif predicted_demand >= (
        current_stock * 0.4
    ):

        return """

        Inventory is currently stable.

        Monitor sales trends regularly.

        """

    # ==================================
    # HEALTHY STOCK
    # ==================================
    return """

    Current inventory is healthy.

    No immediate restocking required.

    """

    