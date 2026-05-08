
# from agent.qa_Agent.agent import (
#     ask_qa_agent
# )

# # ==========================================
# # IMPORT ANALYTICS AGENT
# # ==========================================
# from agent.analytics_agent.agent import (
#     AnalyticsAgent
# )

# # ==========================================
# # IMPORT NEW RETAIL ML AGENT
# # ==========================================
# from agent.retail_ml_agent.agent import (
#     RetailMLAgent
# )


# # ==========================================
# # ORCHESTRATOR AGENT
# # ==========================================
# class OrchestratorAgent:

#     def __init__(self):

#         self.analytics_agent = (
#             AnalyticsAgent()
#         )

#         self.retail_ml_agent = (
#             RetailMLAgent()
#         )

#     # ======================================
#     # ROUTING LOGIC
#     # ======================================
#     def route_agent(

#         self,

#         query,

#         role
#     ):

#         query_lower = query.lower()

#         # ==================================
#         # CUSTOMER
#         # ==================================
#         if role == "user":

#             return "qa"

#         # ==================================
#         # RETAIL OWNER
#         # ==================================
#         if role == "retail":

#             # ==================================
#             # ML FORECAST + ANOMALY ROUTING
#             # ==================================
#             if any(

#                 word in query_lower

#                 for word in [

#                     "forecast",
#                     "prediction",
#                     "predict",
#                     "future",
#                     "future demand",
#                     "future sales",
#                     "demand",
#                     "trend",
#                     "trending",
#                     "growth",
#                     "next month",
#                     "sales forecast",
#                     "demand forecast",
#                     "forecasting",
#                     "anomaly",
#                     "abnormal",
#                     "spike",
#                     "suspicious",
#                     "restock"
#                 ]
#             ):

#                 return "retail_ml"

#             # ==================================
#             # ANALYTICS ROUTING
#             # ==================================
#             if any(

#                 word in query_lower

#                 for word in [

#                     "analytics",
#                     "sales",
#                     "report",
#                     "summary",
#                     "business",
#                     "profit",
#                     "performance",
#                     "inventory",
#                     "stock",
#                     "products",
#                     "payment",
#                     "revenue"
#                 ]
#             ):

#                 return "analytics"

#             return "analytics"

#         return "qa"

#     # ======================================
#     # MAIN EXECUTION
#     # ======================================
#     def run(

#         self,

#         query,

#         role,

#         user_id,

#         db
#     ):

#         try:

#             agent_name = self.route_agent(

#                 query=query,

#                 role=role
#             )

#             print(f"\nROUTED TO: {agent_name}")

#             # ==================================
#             # QA AGENT
#             # ==================================
#             if agent_name == "qa":

#                 response = ask_qa_agent(

#                     query=query,

#                     customer_id=user_id
#                 )

#                 return {

#                     "success": True,

#                     "agent": "qa_agent",

#                     "response": response
#                 }

#             # ==================================
#             # ANALYTICS AGENT
#             # ==================================
#             if agent_name == "analytics":

#                 response = (

#                     self.analytics_agent.run(

#                         query=query,

#                         retailer_id=user_id,

#                         db=db
#                     )
#                 )

#                 return {

#                     "success": True,

#                     "agent": "analytics_agent",

#                     "response": response
#                 }

#             # ==================================
#             # RETAIL ML AGENT
#             # ==================================
#             if agent_name == "retail_ml":

#                 response = (

#                     self.retail_ml_agent.run(

#                         query=query,

#                         retailer_id=user_id,

#                         db=db
#                     )
#                 )

#                 print("\nML RESPONSE:")
#                 print(response)

#                 return {

#                     "success": True,

#                     "agent": "retail_ml_agent",

#                     "response": response
#                 }

#             return {

#                 "success": False,

#                 "message":
#                 "No suitable agent found."
#             }

#         except Exception as e:

#             print("ORCHESTRATOR ERROR:", e)

#             return {

#                 "success": False,

#                 "message": str(e)
#             }

import os

from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

from agent.qa_Agent.agent import ask_qa_agent

from agent.analytics_agent.agent import AnalyticsAgent

from agent.retail_ml_agent.agent import RetailMLAgent


# ==========================================
# LLM
# ==========================================
llm = AzureChatOpenAI(

    azure_endpoint=os.getenv(
        "AZURE_OPENAI_ENDPOINT"
    ),

    api_key=os.getenv(
        "AZURE_OPENAI_API_KEY"
    ),

    api_version=os.getenv(
        "AZURE_OPENAI_API_VERSION"
    ),

    deployment_name=os.getenv(
        "AZURE_OPENAI_DEPLOYMENT_NAME"
    ),

    temperature=0
)


# ==========================================
# ORCHESTRATOR STATE
# ==========================================
class OrchestratorState(TypedDict):

    query: str

    role: str

    user_id: int

    db: object

    agent_name: str

    response: dict


# ==========================================
# ORCHESTRATOR AGENT
# ==========================================
class OrchestratorAgent:

    def __init__(self):

        self.analytics_agent = AnalyticsAgent()

        self.retail_ml_agent = RetailMLAgent()

        self.graph = self._build_graph()

    # ======================================
    # ROUTING KEYWORDS
    # ======================================
    ML_KEYWORDS = [
        "forecast",
        "prediction",
        "predict",
        "future",
        "future demand",
        "future sales",
        "demand",
        "trend",
        "trending",
        "growth",
        "next month",
        "sales forecast",
        "demand forecast",
        "forecasting",
        "anomaly",
        "abnormal",
        "spike",
        "suspicious",
        "restock"
    ]

    ANALYTICS_KEYWORDS = [
        "analytics",
        "sales",
        "report",
        "summary",
        "business",
        "profit",
        "performance",
        "inventory",
        "stock",
        "products",
        "payment",
        "revenue"
    ]

    # ======================================
    # BUILD LANGGRAPH
    # ======================================
    def _build_graph(self):

        orchestrator_self = self

        # ----------------------------------
        # ROUTER NODE
        # ----------------------------------
        def router_node(state: OrchestratorState):

            role = state["role"]
            query_lower = state["query"].lower()

            # Customer → always QA
            if role == "user":
                return {"agent_name": "qa"}

            # Retail owner → keyword-based routing
            if role == "retail":

                if any(
                    word in query_lower
                    for word in orchestrator_self.ML_KEYWORDS
                ):
                    return {"agent_name": "retail_ml"}

                if any(
                    word in query_lower
                    for word in orchestrator_self.ANALYTICS_KEYWORDS
                ):
                    return {"agent_name": "analytics"}

                return {"agent_name": "analytics"}

            # Default
            return {"agent_name": "qa"}

        # ----------------------------------
        # QA NODE
        # ----------------------------------
        def qa_node(state: OrchestratorState):

            print("\nROUTED TO: qa")

            response = ask_qa_agent(
                query=state["query"],
                customer_id=state["user_id"]
            )

            return {
                "response": {
                    "success": True,
                    "agent": "qa_agent",
                    "response": response
                }
            }

        # ----------------------------------
        # ANALYTICS NODE
        # ----------------------------------
        def analytics_node(state: OrchestratorState):

            print("\nROUTED TO: analytics")

            response = orchestrator_self.analytics_agent.run(
                query=state["query"],
                retailer_id=state["user_id"],
                db=state["db"]
            )

            return {
                "response": {
                    "success": True,
                    "agent": "analytics_agent",
                    "response": response
                }
            }

        # ----------------------------------
        # RETAIL ML NODE
        # ----------------------------------
        def retail_ml_node(state: OrchestratorState):

            print("\nROUTED TO: retail_ml")

            response = orchestrator_self.retail_ml_agent.run(
                query=state["query"],
                retailer_id=state["user_id"],
                db=state["db"]
            )

            print("\nML RESPONSE:")
            print(response)

            return {
                "response": {
                    "success": True,
                    "agent": "retail_ml_agent",
                    "response": response
                }
            }

        # ----------------------------------
        # CONDITIONAL ROUTING FUNCTION
        # ----------------------------------
        def decide_agent(state: OrchestratorState):

            return state["agent_name"]

        # ----------------------------------
        # BUILD GRAPH
        # ----------------------------------
        graph = StateGraph(OrchestratorState)

        graph.add_node("router", router_node)
        graph.add_node("qa", qa_node)
        graph.add_node("analytics", analytics_node)
        graph.add_node("retail_ml", retail_ml_node)

        graph.set_entry_point("router")

        graph.add_conditional_edges(
            "router",
            decide_agent,
            {
                "qa": "qa",
                "analytics": "analytics",
                "retail_ml": "retail_ml"
            }
        )

        graph.add_edge("qa", END)
        graph.add_edge("analytics", END)
        graph.add_edge("retail_ml", END)

        return graph.compile()

    # ======================================
    # MAIN EXECUTION
    # ======================================
    def run(
        self,
        query,
        role,
        user_id,
        db
    ):

        try:

            result = self.graph.invoke({
                "query": query,
                "role": role,
                "user_id": user_id,
                "db": db,
                "agent_name": "",
                "response": {}
            })

            return result["response"]

        except Exception as e:

            print("ORCHESTRATOR ERROR:", e)

            return {
                "success": False,
                "message": str(e)
            }