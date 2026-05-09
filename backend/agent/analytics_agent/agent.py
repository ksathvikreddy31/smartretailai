
import os
import json

from sqlalchemy.orm import Session

from langchain_openai import AzureChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from typing import TypedDict, Annotated
import operator

from app.database.models import (
    RetailerProduct,
    RestockRequest,
    Order,
    OrderItem,
    Payment
)

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
class AnalyticsState(TypedDict):

    query: str

    retailer_id: int

    analytics: dict

    messages: Annotated[list, operator.add]

    response: str


# ==========================================
# ANALYTICS AGENT
# ==========================================
class AnalyticsAgent:

    # ======================================
    # ALL PRODUCTS
    # ======================================
    def get_all_products(
        self,
        retailer_id,
        db: Session
    ):

        products = (

            db.query(RetailerProduct)

            .filter(
                RetailerProduct.retailer_id
                == retailer_id
            )

            .all()
        )

        return [

            {
                "product":
                product.name,

                "stock":
                product.quantity,

                "category":
                product.category,

                "price":
                float(product.price),

                "status":
                (
                    "Critical"
                    if product.quantity < 10
                    else "Low Stock"
                    if product.quantity < 50
                    else "In Stock"
                )
            }

            for product in products
        ]

    # ======================================
    # TOTAL SALES
    # ======================================
    def get_total_sales(
        self,
        retailer_id,
        db: Session
    ):

        orders = (

            db.query(Order)

            .filter(
                Order.retailer_id
                == retailer_id
            )

            .all()
        )

        total = sum(

            float(order.total_price or 0)

            for order in orders
        )

        return round(total, 2)

    # ======================================
    # TOTAL ORDERS
    # ======================================
    def get_total_orders(
        self,
        retailer_id,
        db: Session
    ):

        return (

            db.query(Order)

            .filter(
                Order.retailer_id
                == retailer_id
            )

            .count()
        )

    # ======================================
    # LOW STOCK PRODUCTS
    # ======================================
    def get_low_stock_products(
        self,
        retailer_id,
        db: Session
    ):

        products = (

            db.query(RetailerProduct)

            .filter(
                RetailerProduct.retailer_id
                == retailer_id
            )

            .filter(
                RetailerProduct.quantity < 50
            )

            .all()
        )

        return [

            {
                "product":
                product.name,

                "stock":
                product.quantity,

                "category":
                product.category,

                "status":
                (
                    "Critical"
                    if product.quantity < 10
                    else "Low Stock"
                )
            }

            for product in products
        ]

    # ======================================
    # TOP PRODUCTS
    # ======================================
    def get_top_products(
        self,
        retailer_id,
        db: Session
    ):

        orders = (

            db.query(Order)

            .filter(
                Order.retailer_id
                == retailer_id
            )

            .all()
        )

        product_sales = {}

        for order in orders:

            items = (

                db.query(OrderItem)

                .filter(
                    OrderItem.order_id
                    == order.id
                )

                .all()
            )

            for item in items:

                if item.product is None:
                    continue

                product_name = item.product.name
                quantity = item.quantity

                if product_name not in product_sales:
                    product_sales[product_name] = 0

                product_sales[product_name] += quantity

        sorted_products = sorted(

            product_sales.items(),

            key=lambda x: x[1],

            reverse=True
        )

        return [

            {
                "product": product,
                "units_sold": units
            }

            for product, units
            in sorted_products[:5]
        ]

    # ======================================
    # PENDING RESTOCKS
    # ======================================
    def get_pending_restocks(
        self,
        retailer_id,
        db: Session
    ):

        requests = (

            db.query(RestockRequest)

            .filter(
                RestockRequest.retailer_id
                == retailer_id
            )

            .filter(
                RestockRequest.status
                == "Pending"
            )

            .all()
        )

        return [

            {
                "product":
                request.product_name,

                "quantity":
                request.requested_quantity,

                "status":
                request.status
            }

            for request in requests
        ]

    # ======================================
    # PAYMENT SUMMARY
    # ======================================
    def get_payment_summary(
        self,
        retailer_id,
        db: Session
    ):

        payments = (

            db.query(Payment)

            .filter(
                Payment.retailer_id
                == retailer_id
            )

            .all()
        )

        total = sum(

            float(payment.amount or 0)

            for payment in payments
        )

        return {

            "total_revenue":
            round(total, 2),

            "completed":
            len([
                p for p in payments
                if p.status == "Completed"
            ]),

            "pending":
            len([
                p for p in payments
                if p.status == "Pending"
            ])
        }

    # ======================================
    # BUILD LANGGRAPH
    # ======================================
    def _build_graph(self, db: Session, retailer_id: int):

        agent_self = self

        # ----------------------------------
        # LANGCHAIN TOOLS
        # ----------------------------------
        @tool
        def tool_get_all_products(dummy: str = "") -> str:
            """Get all products and their stock status for the retailer."""
            result = agent_self.get_all_products(retailer_id, db)
            return json.dumps(result)

        @tool
        def tool_get_total_sales(dummy: str = "") -> str:
            """Get total sales revenue for the retailer."""
            result = agent_self.get_total_sales(retailer_id, db)
            return json.dumps({"total_sales": result})

        @tool
        def tool_get_total_orders(dummy: str = "") -> str:
            """Get total number of orders for the retailer."""
            result = agent_self.get_total_orders(retailer_id, db)
            return json.dumps({"total_orders": result})

        @tool
        def tool_get_low_stock(dummy: str = "") -> str:
            """Get products with low stock (below 50 units)."""
            result = agent_self.get_low_stock_products(retailer_id, db)
            return json.dumps(result)

        @tool
        def tool_get_top_products(dummy: str = "") -> str:
            """Get the top 5 best-selling products by units sold."""
            result = agent_self.get_top_products(retailer_id, db)
            return json.dumps(result)

        @tool
        def tool_get_pending_restocks(dummy: str = "") -> str:
            """Get all pending restock requests for the retailer."""
            result = agent_self.get_pending_restocks(retailer_id, db)
            return json.dumps(result)

        @tool
        def tool_get_payment_summary(dummy: str = "") -> str:
            """Get payment summary including total revenue and counts."""
            result = agent_self.get_payment_summary(retailer_id, db)
            return json.dumps(result)

        tools = [
            tool_get_all_products,
            tool_get_total_sales,
            tool_get_total_orders,
            tool_get_low_stock,
            tool_get_top_products,
            tool_get_pending_restocks,
            tool_get_payment_summary,
        ]

        llm_with_tools = llm.bind_tools(tools)

        SYSTEM_PROMPT = """
        You are SmartRetailAI Analytics Assistant.

        Responsibilities:
        - Analyze sales
        - Analyze inventory
        - Explain low stock
        - Explain payments
        - Explain business performance
        - Give concise business insights

        IMPORTANT:
        - If user asks about products, use tool_get_all_products.
        - If user asks about low stock, use tool_get_low_stock.
        - If user asks about payments, use tool_get_payment_summary.
        - If user asks about sales, use tool_get_total_sales.
        - If user asks about inventory, use tool_get_all_products.

        Never mention only low-stock products when user asks
        about all inventory/products.
        """

        # ----------------------------------
        # NODES
        # ----------------------------------
        def agent_node(state: AnalyticsState):
            messages = state["messages"]
            if not any(
                isinstance(m, SystemMessage)
                for m in messages
            ):
                messages = [
                    SystemMessage(content=SYSTEM_PROMPT)
                ] + messages

            response = llm_with_tools.invoke(messages)

            return {"messages": [response]}

        def should_continue(state: AnalyticsState):
            last = state["messages"][-1]
            if hasattr(last, "tool_calls") and last.tool_calls:
                return "tools"
            return END

        def finalize(state: AnalyticsState):
            last = state["messages"][-1]
            return {"response": last.content}

        # ----------------------------------
        # BUILD GRAPH
        # ----------------------------------
        tool_node = ToolNode(tools)

        graph = StateGraph(AnalyticsState)

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
    # MAIN RUNNER
    # ======================================
    def run(
        self,
        query,
        retailer_id,
        db: Session
    ):

        compiled = self._build_graph(db, retailer_id)

        result = compiled.invoke({
            "query": query,
            "retailer_id": retailer_id,
            "analytics": {},
            "messages": [HumanMessage(content=query)],
            "response": ""
        })

        return {
            "summary": result["response"],
            "analytics": result.get("analytics", {})
        }