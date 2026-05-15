
from langchain_core.messages import HumanMessage, SystemMessage

from .retriever import retrieve_company_context

from .tools import (
    get_cart_contents,
    get_customer_orders,
    get_payment_status,
    search_product,
    fuzzy_match_product,
)

from .prompt import SYSTEM_PROMPT

from .llm import llm


# ==========================================
# RAG KEYWORDS
# ==========================================
RAG_KEYWORDS = [

    "about smartretail",
    "smartretailai",
    "company",
    "policy",
    "policies",
    "faq",
    "support hours",
    "human agent",
    "customer support",
    "return policy",
    "returns",
    "return process",
    "refund policy",
    "refund process",
    "refund timeline",
    "cancellation",
    "cancel policy",
    "shipping",
    "shipping policy",
    "standard shipping",
    "express shipping",
    "delivery policy",
    "loyalty",
    "loyalty program",
    "warranty",
]


# ==========================================
# ROUTER NODE
# ==========================================
def router_node(state):

    query = state["query"].lower()

    # ---------------------------
    # COMPANY INFO / POLICIES
    # ---------------------------
    if any(word in query for word in RAG_KEYWORDS):

        intent = "rag"

    # ---------------------------
    # CART
    # ---------------------------
    elif any(word in query for word in [

        "cart",
        "my cart",
        "shopping cart",
        "items in cart",
        "what's in my cart",
        "whats in my cart",
        "cart contents",
        "cart total",
        "added to cart",
        "in my basket",
    ]):

        intent = "cart"

    # ---------------------------
    # ORDERS
    # ---------------------------
    elif any(word in query for word in [

        "my order",
        "my orders",
        "order status",
        "track",
        "tracking",
        "delivery",
        "shipped",
        "dispatch",
        "what did i order",
        "past order",
        "purchase history",
        "i ordered",
        "placed order",
    ]):

        intent = "orders"

    # ---------------------------
    # PAYMENTS
    # ---------------------------
    elif any(word in query for word in [

        "payment",
        "refund",
        "transaction",
        "paid",
        "billing",
        "invoice",
        "receipt",
        "charge",
    ]):

        intent = "payments"

    # ---------------------------
    # PRODUCTS
    # ---------------------------
    elif any(word in query for word in [

        "product",
        "products",
        "price",
        "cost",
        "stock",
        "available",
        "availability",
        "do you have",
        "do you sell",
        "sell",
        "buy",
        "purchase",
        "how much",
        "show me",
        "looking for",
        "want to buy",
        "i need",
        "shop",
        "store",
        "catalog",
        "items",
    ]):

        intent = "products"

    # ---------------------------
    # DYNAMIC FUZZY PRODUCT MATCH
    # ---------------------------
    elif fuzzy_match_product(query):

        intent = "products"

    # ---------------------------
    # DEFAULT → RAG
    # ---------------------------
    else:

        intent = "rag"

    return {

        **state,

        "intent": intent
    }


# ==========================================
# RAG NODE
# ==========================================
def rag_node(state):

    query = state["query"]

    context = retrieve_company_context(query)

    messages = [

        SystemMessage(
            content=SYSTEM_PROMPT
        ),

        HumanMessage(

            content=(

                f"COMPANY INFORMATION:\n"
                f"{context}\n\n"

                f"USER QUESTION:\n"
                f"{query}\n\n"

                f"ANSWER:"
            )
        )
    ]

    response = llm.invoke(messages)

    return {

        **state,

        "messages": [response],

        "response": response.content
    }


# ==========================================
# TOOL NODE
# ==========================================
def tool_node(state):

    intent = state["intent"]

    customer_id = state["customer_id"]

    query = state["query"]

    # ---------------------------
    # CART
    # ---------------------------
    if intent == "cart":

        tool_result = get_cart_contents(
            customer_id
        )

    # ---------------------------
    # ORDERS
    # ---------------------------
    elif intent == "orders":

        tool_result = get_customer_orders(
            customer_id
        )

    # ---------------------------
    # PAYMENTS
    # ---------------------------
    elif intent == "payments":

        tool_result = get_payment_status(
            customer_id
        )

    # ---------------------------
    # PRODUCTS
    # ---------------------------
    elif intent == "products":

        tool_result = search_product(
            query
        )

    # ---------------------------
    # UNKNOWN
    # ---------------------------
    else:

        tool_result = (
            "No matching tool found."
        )

    # ----------------------------------
    # SEND RESULT TO LLM
    # ----------------------------------
    messages = [

        SystemMessage(
            content=SYSTEM_PROMPT
        ),

        HumanMessage(

            content=(

                f"TOOL RESULT:\n"
                f"{tool_result}\n\n"

                f"USER QUESTION:\n"
                f"{query}\n\n"

                f"ANSWER:"
            )
        )
    ]

    response = llm.invoke(messages)

    return {

        **state,

        "messages": [response],

        "response": response.content
    }