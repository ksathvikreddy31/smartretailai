
import os

from langchain_openai import AzureChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from typing import TypedDict, Annotated
import operator

from agent.retail_ml_agent.tools import (
    forecast_product,
    anomaly_check
)

from agent.retail_ml_agent.prompt import RETAIL_ML_PROMPT

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

    temperature=0.3
)

# ==========================================
# AGENT STATE
# ==========================================
class RetailMLState(TypedDict):

    query: str

    retailer_id: int

    messages: Annotated[list, operator.add]

    response: str


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
# LANGCHAIN TOOLS
# ==========================================
@tool
def tool_forecast_product(product_name: str) -> str:
    """
    Forecast future sales demand for a specific product.
    Accepts product name: smartphone, jeans, mixer grinder,
    or electric toothbrush.
    """

    query_lower = product_name.lower()

    product_id = None

    for name, pid in PRODUCT_MAP.items():

        if name in query_lower:

            product_id = pid
            break

    if product_id is None:

        return (
            "Product not found in forecast system. "
            "Available: smartphone, jeans, mixer grinder, "
            "electric toothbrush."
        )

    forecast = forecast_product(product_id)

    if forecast is None:

        return "Forecast model unavailable for this product."

    latest = forecast.iloc[-1]

    predicted_sales = round(latest["yhat"], 2)

    trend = (
        "High Demand — Recommend Restocking Soon"
        if predicted_sales > 50
        else "Stable Demand"
    )

    return (
        f"Product: {product_name.title()}\n"
        f"Predicted Sales (next period): {predicted_sales}\n"
        f"Trend: {trend}"
    )

    
@tool
def tool_anomaly_check(product_name: str) -> str:
    """
    Check for sales anomalies or suspicious spikes for a product.
    Accepts product name: smartphone, jeans, mixer grinder,
    or electric toothbrush.
    """

    query_lower = product_name.lower()

    product_id = None

    found_name = None

    for name, pid in PRODUCT_MAP.items():

        if name in query_lower:

            product_id = pid

            found_name = name

            break

    if product_id is None:

        return (
            "Product not found. "
            "Available: smartphone, jeans, mixer grinder, "
            "electric toothbrush."
        )

    result = anomaly_check(product_id)

    if result is None:

        return "Anomaly model unavailable for this product."

    if result == -1:

        return (
            f"⚠️ Anomaly Detected in "
            f"{found_name.title()} sales. "
            f"Unusual activity flagged."
        )

    return (
        f"✅ No anomaly detected for "
        f"{found_name.title()}. Sales look normal."
    )


# ==========================================
# RETAIL ML AGENT
# ==========================================
class RetailMLAgent:

    def __init__(self):

        self.tools = [
            tool_forecast_product,
            tool_anomaly_check
        ]

        self.llm_with_tools = llm.bind_tools(
            self.tools
        )

    # ======================================
    # BUILD LANGGRAPH
    # ======================================
    def _build_graph(self):

        llm_with_tools = self.llm_with_tools

        # ----------------------------------
        # AGENT NODE
        # ----------------------------------
        def agent_node(state: RetailMLState):

            messages = state["messages"]

            if not any(
                isinstance(m, SystemMessage)
                for m in messages
            ):
                messages = [
                    SystemMessage(
                        content=RETAIL_ML_PROMPT
                    )
                ] + messages

            response = llm_with_tools.invoke(messages)

            return {"messages": [response]}

        # ----------------------------------
        # SHOULD CONTINUE
        # ----------------------------------
        def should_continue(state: RetailMLState):

            last = state["messages"][-1]

            if (
                hasattr(last, "tool_calls")
                and last.tool_calls
            ):
                return "tools"

            return END

        # ----------------------------------
        # FINALIZE
        # ----------------------------------
        def finalize(state: RetailMLState):

            last = state["messages"][-1]

            return {"response": last.content}

        # ----------------------------------
        # BUILD GRAPH
        # ----------------------------------
        tool_node = ToolNode(self.tools)

        graph = StateGraph(RetailMLState)

        graph.add_node("agent", agent_node)
        graph.add_node("tools", tool_node)
        graph.add_node("finalize", finalize)

        graph.set_entry_point("agent")

        graph.add_conditional_edges(
            "agent",
            should_continue,
            {"tools": "tools", END: "finalize"}
        )

        graph.add_edge("tools", "agent")
        graph.add_edge("finalize", END)

        return graph.compile()

    # ======================================
    # MAIN RUN
    # ======================================
    def run(
        self,
        query,
        retailer_id,
        db
    ):

        compiled = self._build_graph()

        result = compiled.invoke({
            "query": query,
            "retailer_id": retailer_id,
            "messages": [HumanMessage(content=query)],
            "response": ""
        })

        return result["response"]