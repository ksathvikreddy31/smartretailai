# # import os

# # from openai import AzureOpenAI

# # from sqlalchemy.orm import Session

# # from agent.forecast_agent.prompt import (
# #     FORECAST_AGENT_PROMPT
# # )

# # from agent.forecast_agent.tools import (

# #     forecast_demand,

# #     generate_restock_recommendation
# # )

# # # ======================================
# # # FORECAST AGENT
# # # ======================================
# # class ForecastAgent:

# #     def __init__(self):

# #         self.client = AzureOpenAI(

# #             api_key=os.getenv(
# #                 "AZURE_OPENAI_API_KEY"
# #             ),

# #             api_version=os.getenv(
# #                 "AZURE_OPENAI_API_VERSION"
# #             ),

# #             azure_endpoint=os.getenv(
# #                 "AZURE_OPENAI_ENDPOINT"
# #             )
# #         )

# #     # ==================================
# #     # FIND PRODUCT
# #     # ==================================
# #     def find_product(

# #         self,

# #         query,

# #         db: Session,

# #         retailer_id
# #     ):

# #         from app.database.models import (
# #             RetailerProduct
# #         )

# #         products = (

# #             db.query(RetailerProduct)

# #             .filter(
# #                 RetailerProduct.retailer_id
# #                 == retailer_id
# #             )

# #             .all()
# #         )

# #         query_lower = query.lower()

# #         for product in products:

# #             if product.name.lower() in query_lower:

# #                 return product

# #         return None

# #     # ==================================
# #     # RUN AGENT
# #     # ==================================
# #     def run(

# #         self,

# #         query,

# #         retailer_id,

# #         db: Session
# #     ):

# #         # --------------------------------
# #         # FIND PRODUCT
# #         # --------------------------------
# #         product = self.find_product(

# #             query=query,

# #             db=db,

# #             retailer_id=retailer_id
# #         )

# #         # --------------------------------
# #         # PRODUCT NOT FOUND
# #         # --------------------------------
# #         if not product:

# #             return {

# #                 "success": False,

# #                 "message":
# #                 "Product not found in inventory."
# #             }

# #         # --------------------------------
# #         # CREATE ML PAYLOAD
# #         # --------------------------------
# #         payload = {

# #             "product_id":
# #             product.id,

# #             "category":
# #             product.category,

# #             "price":
# #             float(product.price),

# #             "stock":
# #             int(product.quantity),

# #             "discount":
# #             10,

# #             "customer_region":
# #             "South",

# #             "month":
# #             5,

# #             "day_of_week":
# #             2
# #         }

# #         # --------------------------------
# #         # FORECAST DEMAND
# #         # --------------------------------
# #         prediction = (
# #             forecast_demand(payload)
# #         )

# #         predicted_value = (

# #             prediction[
# #                 "predicted_demand"
# #             ]
# #         )

# #         current_stock = (

# #             prediction[
# #                 "current_stock"
# #             ]
# #         )

# #         stock_status = (

# #             prediction[
# #                 "stock_status"
# #             ]
# #         )

# #         # --------------------------------
# #         # RESTOCK RECOMMENDATION
# #         # --------------------------------
# #         recommendation = (

# #             generate_restock_recommendation(

# #                 current_stock=
# #                 current_stock,

# #                 predicted_demand=
# #                 predicted_value
# #             )
# #         )

# #         # --------------------------------
# #         # AI PROMPT
# #         # --------------------------------
# #         prompt = f"""

# #         Retail Owner Question:
# #         {query}

# #         Product:
# #         {product.name}

# #         Current Stock:
# #         {current_stock}

# #         Predicted Demand:
# #         {predicted_value}

# #         Stock Status:
# #         {stock_status}

# #         Recommendation:
# #         {recommendation}

# #         Explain:

# #         - future demand trend
# #         - stock risk
# #         - inventory impact
# #         - business recommendation
# #         """

# #         # --------------------------------
# #         # AZURE OPENAI RESPONSE
# #         # --------------------------------
# #         response = (

# #             self.client.chat.completions
# #             .create(

# #                 model=os.getenv(
# #                     "AZURE_OPENAI_DEPLOYMENT_NAME"
# #                 ),

# #                 messages=[

# #                     {
# #                         "role": "system",

# #                         "content":
# #                         FORECAST_AGENT_PROMPT
# #                     },

# #                     {
# #                         "role": "user",

# #                         "content":
# #                         prompt
# #                     }
# #                 ]
# #             )
# #         )

# #         # --------------------------------
# #         # RETURN RESPONSE
# #         # --------------------------------
# #         return {

# #             "success": True,

# #             "product":
# #             product.name,

# #             "prediction":
# #             predicted_value,

# #             "stock_status":
# #             stock_status,

# #             "recommendation":
# #             recommendation,

# #             "analysis":
# #             response.choices[0]
# #             .message.content
# #         }

# import os

# from openai import AzureOpenAI

# from sqlalchemy.orm import Session

# from agent.forecast_agent.prompt import (
#     FORECAST_AGENT_PROMPT
# )

# from agent.forecast_agent.tools import (

#     forecast_demand,

#     generate_restock_recommendation
# )

# # ======================================
# # FORECAST AGENT
# # ======================================
# class ForecastAgent:

#     def __init__(self):

#         self.client = AzureOpenAI(

#             api_key=os.getenv(
#                 "AZURE_OPENAI_API_KEY"
#             ),

#             api_version=os.getenv(
#                 "AZURE_OPENAI_API_VERSION"
#             ),

#             azure_endpoint=os.getenv(
#                 "AZURE_OPENAI_ENDPOINT"
#             )
#         )

#     # ==================================
#     # FIND PRODUCT
#     # ==================================
#     def find_product(

#         self,

#         query,

#         db: Session,

#         retailer_id
#     ):

#         from app.database.models import (
#             RetailerProduct
#         )

#         products = (

#             db.query(RetailerProduct)

#             .filter(
#                 RetailerProduct.retailer_id
#                 == retailer_id
#             )

#             .all()
#         )

#         query_lower = query.lower()

#         for product in products:

#             if product.name.lower() in query_lower:

#                 return product

#         return None

#     # ==================================
#     # RUN AGENT
#     # ==================================
#     def run(

#         self,

#         query,

#         retailer_id,

#         db: Session
#     ):

#         try:

#             # --------------------------------
#             # FIND PRODUCT
#             # --------------------------------
#             product = self.find_product(

#                 query=query,

#                 db=db,

#                 retailer_id=retailer_id
#             )

#             print("\nDETECTED PRODUCT:")
#             print(product)

#             # =================================
#             # GLOBAL FORECAST
#             # =================================
#             if not product:

#                 from services.forecast_service import (
#                     predict_demand
#                 )

#                 global_forecast = (
#                     predict_demand(days=30)
#                 )

#                 return {

#                     "success": True,

#                     "forecast_type":
#                     "global_forecast",

#                     "forecast":
#                     global_forecast
#                 }

#             # --------------------------------
#             # CREATE ML PAYLOAD
#             # --------------------------------
#             payload = {

#                 "product_id":
#                 product.id,

#                 "category":
#                 product.category,

#                 "price":
#                 float(product.price),

#                 "stock":
#                 int(product.quantity),

#                 "discount":
#                 10,

#                 "customer_region":
#                 "South",

#                 "month":
#                 5,

#                 "day_of_week":
#                 2
#             }

#             # --------------------------------
#             # FORECAST DEMAND
#             # --------------------------------
#             prediction = (
#                 forecast_demand(payload)
#             )

#             predicted_value = (

#                 prediction[
#                     "predicted_demand"
#                 ]
#             )

#             current_stock = (

#                 prediction[
#                     "current_stock"
#                 ]
#             )

#             stock_status = (

#                 prediction[
#                     "stock_status"
#                 ]
#             )

#             # --------------------------------
#             # RESTOCK RECOMMENDATION
#             # --------------------------------
#             recommendation = (

#                 generate_restock_recommendation(

#                     current_stock=
#                     current_stock,

#                     predicted_demand=
#                     predicted_value
#                 )
#             )

#             # --------------------------------
#             # AI PROMPT
#             # --------------------------------
#             prompt = f"""

#             Retail Owner Question:
#             {query}

#             Product:
#             {product.name}

#             Current Stock:
#             {current_stock}

#             Predicted Demand:
#             {predicted_value}

#             Stock Status:
#             {stock_status}

#             Recommendation:
#             {recommendation}

#             Explain:

#             - future demand trend
#             - stock risk
#             - inventory impact
#             - business recommendation
#             """

#             # --------------------------------
#             # AZURE OPENAI RESPONSE
#             # --------------------------------
#             response = (

#                 self.client.chat.completions
#                 .create(

#                     model=os.getenv(
#                         "AZURE_OPENAI_DEPLOYMENT_NAME"
#                     ),

#                     messages=[

#                         {
#                             "role": "system",

#                             "content":
#                             FORECAST_AGENT_PROMPT
#                         },

#                         {
#                             "role": "user",

#                             "content":
#                             prompt
#                         }
#                     ]
#                 )
#             )

#             # --------------------------------
#             # RETURN RESPONSE
#             # --------------------------------
#             return {

#                 "success": True,

#                 "forecast_type":
#                 "product_forecast",

#                 "product":
#                 product.name,

#                 "prediction":
#                 predicted_value,

#                 "stock_status":
#                 stock_status,

#                 "recommendation":
#                 recommendation,

#                 "analysis":
#                 response.choices[0]
#                 .message.content
#             }

#         except Exception as e:

#             print(
#                 "FORECAST AGENT ERROR:",
#                 e
#             )

#             return {

#                 "success": False,

#                 "message": str(e)
#             }

# ======================================
# FILE:
# agent/forecast_agent/agent.py
# ======================================

import os

from openai import AzureOpenAI

from sqlalchemy.orm import Session

from agent.forecast_agent.prompt import (
    FORECAST_AGENT_PROMPT
)

from agent.forecast_agent.tools import (

    forecast_demand,

    generate_restock_recommendation
)

# ======================================
# CORRECT IMPORT
# ======================================
from app.services.forecast_service import (
    predict_demand
)

# ======================================
# FORECAST AGENT
# ======================================
class ForecastAgent:

    def __init__(self):

        self.client = AzureOpenAI(

            api_key=os.getenv(
                "AZURE_OPENAI_API_KEY"
            ),

            api_version=os.getenv(
                "AZURE_OPENAI_API_VERSION"
            ),

            azure_endpoint=os.getenv(
                "AZURE_OPENAI_ENDPOINT"
            )
        )

    # ==================================
    # FIND PRODUCT
    # ==================================
    def find_product(

        self,

        query,

        db: Session,

        retailer_id
    ):

        from app.database.models import (
            RetailerProduct
        )

        products = (

            db.query(RetailerProduct)

            .filter(
                RetailerProduct.retailer_id
                == retailer_id
            )

            .all()
        )

        query_lower = query.lower()

        for product in products:

            if (
                product.name.lower()
                in query_lower
            ):

                return product

        return None

    # ==================================
    # RUN AGENT
    # ==================================
    def run(

        self,

        query,

        retailer_id,

        db: Session
    ):

        try:

            # --------------------------------
            # FIND PRODUCT
            # --------------------------------
            product = self.find_product(

                query=query,

                db=db,

                retailer_id=retailer_id
            )

            print("\nDETECTED PRODUCT:")
            print(product)

            # =================================
            # GLOBAL FORECAST
            # =================================
            if not product:

                global_forecast = (
                    predict_demand(days=30)
                )

                print(
                    "\nGLOBAL FORECAST:"
                )

                print(global_forecast)

                return {

                    "success": True,

                    "forecast_type":
                    "global_forecast",

                    "forecast":
                    global_forecast
                }

            # --------------------------------
            # CREATE ML PAYLOAD
            # --------------------------------
            payload = {

                "product_id":
                product.id,

                "category":
                product.category,

                "price":
                float(product.price),

                "stock":
                int(product.quantity),

                "discount":
                10,

                "customer_region":
                "South",

                "month":
                5,

                "day_of_week":
                2
            }

            # --------------------------------
            # FORECAST DEMAND
            # --------------------------------
            prediction = (
                forecast_demand(payload)
            )

            predicted_value = (

                prediction[
                    "predicted_demand"
                ]
            )

            current_stock = (

                prediction[
                    "current_stock"
                ]
            )

            stock_status = (

                prediction[
                    "stock_status"
                ]
            )

            # --------------------------------
            # RESTOCK RECOMMENDATION
            # --------------------------------
            recommendation = (

                generate_restock_recommendation(

                    current_stock=
                    current_stock,

                    predicted_demand=
                    predicted_value
                )
            )

            # --------------------------------
            # AI PROMPT
            # --------------------------------
            prompt = f"""

            Retail Owner Question:
            {query}

            Product:
            {product.name}

            Current Stock:
            {current_stock}

            Predicted Demand:
            {predicted_value}

            Stock Status:
            {stock_status}

            Recommendation:
            {recommendation}

            Explain:

            - future demand trend
            - stock risk
            - inventory impact
            - business recommendation
            """

            # --------------------------------
            # AZURE OPENAI RESPONSE
            # --------------------------------
            response = (

                self.client.chat.completions
                .create(

                    model=os.getenv(
                        "AZURE_OPENAI_DEPLOYMENT_NAME"
                    ),

                    messages=[

                        {
                            "role": "system",

                            "content":
                            FORECAST_AGENT_PROMPT
                        },

                        {
                            "role": "user",

                            "content":
                            prompt
                        }
                    ]
                )
            )

            # --------------------------------
            # RETURN RESPONSE
            # --------------------------------
            return {

                "success": True,

                "forecast_type":
                "product_forecast",

                "product":
                product.name,

                "prediction":
                predicted_value,

                "stock_status":
                stock_status,

                "recommendation":
                recommendation,

                "analysis":
                response.choices[0]
                .message.content
            }

        except Exception as e:

            print(
                "FORECAST AGENT ERROR:",
                e
            )

            return {

                "success": False,

                "message": str(e)
            }