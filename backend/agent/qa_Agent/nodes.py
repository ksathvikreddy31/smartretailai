# from .retriever import retrieve_company_context

# from .tools import (
#     get_customer_orders,
#     get_payment_status,
#     search_product
# )

# from .prompt import SYSTEM_PROMPT

# from .llm import llm

# # ==========================================
# # ROUTER NODE
# # ==========================================
# def router_node(state):

#     query = state["query"].lower()

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     if any(word in query for word in [
#         "my order",
#         "orders",
#         "track order",
#         "delivery"
#     ]):

#         state["intent"] = "orders"

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "payment",
#         "refund",
#         "transaction"
#     ]):

#         state["intent"] = "payments"

#     # ---------------------------
#     # PRODUCTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "product",
#         "price",
#         "stock",
#         "available"
#     ]):

#         state["intent"] = "products"

#     # ---------------------------
#     # COMPANY INFO
#     # ---------------------------
#     else:

#         state["intent"] = "rag"

#     return state

# # ==========================================
# # RAG NODE
# # ==========================================
# def rag_node(state):

#     context = retrieve_company_context(
#         state["query"]
#     )

#     prompt = f"""
#     {SYSTEM_PROMPT}

#     COMPANY INFORMATION:
#     {context}

#     USER QUESTION:
#     {state["query"]}

#     ANSWER:
#     """

#     response = llm.invoke(prompt)

#     state["response"] = response.content

#     return state

# # ==========================================
# # TOOL NODE
# # ==========================================
# def tool_node(state):

#     intent = state["intent"]

#     customer_id = state["customer_id"]

#     query = state["query"]

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     if intent == "orders":

#         tool_result = get_customer_orders(
#             customer_id
#         )

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif intent == "payments":

#         tool_result = get_payment_status(
#             customer_id
#         )

#     # ---------------------------
#     # PRODUCTS
#     # ---------------------------
#     elif intent == "products":

#         tool_result = search_product(
#             query
#         )

#     else:

#         tool_result = "No matching tool found."

#     prompt = f"""
#     {SYSTEM_PROMPT}

#     TOOL RESULT:
#     {tool_result}

#     USER QUESTION:
#     {query}

#     ANSWER:
#     """

#     response = llm.invoke(prompt)

#     state["response"] = response.content

#     return state

# from langchain_core.messages import HumanMessage, SystemMessage
# from langchain_core.prompts import ChatPromptTemplate

# from .retriever import retrieve_company_context

# from .tools import (
#     get_customer_orders,
#     get_payment_status,
#     search_product
# )

# from .prompt import SYSTEM_PROMPT

# from .llm import llm


# # ==========================================
# # ROUTER NODE
# # ==========================================
# def router_node(state):

#     query = state["query"].lower()

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     if any(word in query for word in [
#         "my order",
#         "orders",
#         "track order",
#         "delivery"
#     ]):
#         intent = "orders"

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "payment",
#         "refund",
#         "transaction"
#     ]):
#         intent = "payments"

#     # ---------------------------
#     # PRODUCTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "product",
#         "price",
#         "stock",
#         "available"
#     ]):
#         intent = "products"

#     # ---------------------------
#     # COMPANY INFO (RAG)
#     # ---------------------------
#     else:
#         intent = "rag"

#     return {
#         **state,
#         "intent": intent
#     }


# # ==========================================
# # RAG NODE
# # ==========================================
# def rag_node(state):

#     query = state["query"]

#     # ----------------------------------
#     # RETRIEVE CONTEXT
#     # ----------------------------------
#     context = retrieve_company_context(query)

#     # ----------------------------------
#     # LANGCHAIN PROMPT TEMPLATE
#     # ----------------------------------
#     prompt_template = ChatPromptTemplate.from_messages([
#         SystemMessage(content=SYSTEM_PROMPT),
#         HumanMessage(content=(
#             "COMPANY INFORMATION:\n{context}\n\n"
#             "USER QUESTION:\n{query}\n\n"
#             "ANSWER:"
#         ))
#     ])

#     chain = prompt_template | llm

#     response = chain.invoke({
#         "context": context,
#         "query": query
#     })

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }


# # ==========================================
# # TOOL NODE
# # ==========================================
# def tool_node(state):

#     intent = state["intent"]
#     customer_id = state["customer_id"]
#     query = state["query"]

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     if intent == "orders":
#         tool_result = get_customer_orders(
#             customer_id
#         )

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif intent == "payments":
#         tool_result = get_payment_status(
#             customer_id
#         )

#     # ---------------------------
#     # PRODUCTS
#     # ---------------------------
#     elif intent == "products":
#         tool_result = search_product(query)

#     else:
#         tool_result = "No matching tool found."

#     # ----------------------------------
#     # LANGCHAIN PROMPT TEMPLATE
#     # ----------------------------------
#     prompt_template = ChatPromptTemplate.from_messages([
#         SystemMessage(content=SYSTEM_PROMPT),
#         HumanMessage(content=(
#             "TOOL RESULT:\n{tool_result}\n\n"
#             "USER QUESTION:\n{query}\n\n"
#             "ANSWER:"
#         ))
#     ])

#     chain = prompt_template | llm

#     response = chain.invoke({
#         "tool_result": str(tool_result),
#         "query": query
#     })

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }

# from langchain_core.messages import HumanMessage, SystemMessage

# from .retriever import retrieve_company_context

# from .tools import (
#     get_customer_orders,
#     get_payment_status,
#     search_product
# )

# from .prompt import SYSTEM_PROMPT

# from .llm import llm


# # ==========================================
# # ROUTER NODE
# # ==========================================
# def router_node(state):

#     query = state["query"].lower()

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     if any(word in query for word in [
#         "my order",
#         "orders",
#         "track order",
#         "delivery"
#     ]):
#         intent = "orders"

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "payment",
#         "refund",
#         "transaction"
#     ]):
#         intent = "payments"

#     # ---------------------------
#     # PRODUCTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "product",
#         "price",
#         "stock",
#         "available",
#         "smartphone",
#         "laptop",
#         "jeans",
#         "toothbrush"
#     ]):
#         intent = "products"

#     # ---------------------------
#     # COMPANY INFO (RAG)
#     # ---------------------------
#     else:
#         intent = "rag"

#     return {
#         **state,
#         "intent": intent
#     }


# # ==========================================
# # RAG NODE
# # ==========================================
# def rag_node(state):

#     query = state["query"]

#     # ----------------------------------
#     # RETRIEVE CONTEXT FROM PINECONE
#     # ----------------------------------
#     context = retrieve_company_context(query)

#     # ----------------------------------
#     # BUILD MESSAGES DIRECTLY
#     # No template placeholders — values
#     # are interpolated with f-strings.
#     # ----------------------------------
#     messages = [

#         SystemMessage(content=SYSTEM_PROMPT),

#         HumanMessage(content=(
#             f"COMPANY INFORMATION:\n{context}\n\n"
#             f"USER QUESTION:\n{query}\n\n"
#             f"ANSWER:"
#         ))
#     ]

#     response = llm.invoke(messages)

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }


# # ==========================================
# # TOOL NODE
# # ==========================================
# def tool_node(state):

#     intent = state["intent"]
#     customer_id = state["customer_id"]
#     query = state["query"]

#     # ---------------------------
#     # CALL THE RIGHT TOOL
#     # ---------------------------
#     if intent == "orders":

#         tool_result = get_customer_orders(
#             customer_id
#         )

#     elif intent == "payments":

#         tool_result = get_payment_status(
#             customer_id
#         )

#     elif intent == "products":

#         tool_result = search_product(query)

#     else:

#         tool_result = "No matching tool found."

#     # ----------------------------------
#     # BUILD MESSAGES DIRECTLY
#     # ----------------------------------
#     messages = [

#         SystemMessage(content=SYSTEM_PROMPT),

#         HumanMessage(content=(
#             f"TOOL RESULT:\n{tool_result}\n\n"
#             f"USER QUESTION:\n{query}\n\n"
#             f"ANSWER:"
#         ))
#     ]

#     response = llm.invoke(messages)

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }

# from langchain_core.messages import HumanMessage, SystemMessage

# from .retriever import retrieve_company_context

# from .tools import (
#     get_customer_orders,
#     get_payment_status,
#     search_product
# )

# from .prompt import SYSTEM_PROMPT

# from .llm import llm


# # ==========================================
# # PRODUCT KEYWORDS
# # All product names in your catalog.
# # Add new ones here as your catalog grows.
# # ==========================================
# PRODUCT_KEYWORDS = [
#     "electric toothbrush",
#     "mixer grinder",
#     "bluetooth speaker",
#     "smart watch",
#     "smartwatch",
#     "smartphone",
#     "headphones",
#     "laptop",
#     "tablet",
#     "television",
#     "refrigerator",
#     "washing machine",
#     "jeans",
#     "shirt",
#     "shoes",
#     "watch",
#     "tv",
# ]


# # ==========================================
# # ROUTER NODE
# # ==========================================
# def router_node(state):

#     query = state["query"].lower()

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     if any(word in query for word in [
#         "my order",
#         "orders",
#         "track order",
#         "delivery"
#     ]):
#         intent = "orders"

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "payment",
#         "refund",
#         "transaction"
#     ]):
#         intent = "payments"

#     # ---------------------------
#     # PRODUCTS
#     # Match any product keyword OR
#     # general product query words.
#     # ---------------------------
#     elif any(word in query for word in (
#         [
#             "product", "price", "stock",
#             "available", "do you have", "sell",
#             "buy", "purchase", "how much",
#             "cost", "show me"
#         ] + PRODUCT_KEYWORDS
#     )):
#         intent = "products"

#     # ---------------------------
#     # COMPANY INFO (RAG)
#     # ---------------------------
#     else:
#         intent = "rag"

#     return {
#         **state,
#         "intent": intent
#     }


# # ==========================================
# # RAG NODE
# # ==========================================
# def rag_node(state):

#     query = state["query"]

#     # ----------------------------------
#     # RETRIEVE CONTEXT FROM PINECONE
#     # ----------------------------------
#     context = retrieve_company_context(query)

#     # ----------------------------------
#     # BUILD MESSAGES WITH F-STRINGS
#     # ----------------------------------
#     messages = [

#         SystemMessage(content=SYSTEM_PROMPT),

#         HumanMessage(content=(
#             f"COMPANY INFORMATION:\n{context}\n\n"
#             f"USER QUESTION:\n{query}\n\n"
#             f"ANSWER:"
#         ))
#     ]

#     response = llm.invoke(messages)

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }


# # ==========================================
# # EXTRACT PRODUCT KEYWORD
# # Pulls the actual product name out of a
# # full natural-language sentence so the DB
# # search gets a clean keyword, not the whole
# # sentence.
# # e.g. "do you have Smartphone?" -> "smartphone"
# # ==========================================
# def extract_product_keyword(query: str) -> str:

#     query_lower = query.lower()

#     # Multi-word keywords checked first (longest match wins)
#     for kw in sorted(PRODUCT_KEYWORDS, key=len, reverse=True):

#         if kw in query_lower:

#             return kw

#     # Fallback: return the original query
#     return query


# # ==========================================
# # TOOL NODE
# # ==========================================
# def tool_node(state):

#     intent = state["intent"]
#     customer_id = state["customer_id"]
#     query = state["query"]

#     # ---------------------------
#     # CALL THE RIGHT TOOL
#     # ---------------------------
#     if intent == "orders":

#         tool_result = get_customer_orders(
#             customer_id
#         )

#     elif intent == "payments":

#         tool_result = get_payment_status(
#             customer_id
#         )

#     elif intent == "products":

#         # ------------------------------------------
#         # EXTRACT CLEAN KEYWORD BEFORE DB SEARCH
#         # Fixes: "do you have Smartphone" -> "smartphone"
#         # Without this, the full sentence is passed
#         # to ilike() and no product matches.
#         # ------------------------------------------
#         search_term = extract_product_keyword(query)

#         tool_result = search_product(search_term)

#     else:

#         tool_result = "No matching tool found."

#     # ----------------------------------
#     # BUILD MESSAGES WITH F-STRINGS
#     # ----------------------------------
#     messages = [

#         SystemMessage(content=SYSTEM_PROMPT),

#         HumanMessage(content=(
#             f"TOOL RESULT:\n{tool_result}\n\n"
#             f"USER QUESTION:\n{query}\n\n"
#             f"ANSWER:"
#         ))
#     ]

#     response = llm.invoke(messages)

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }

# from langchain_core.messages import HumanMessage, SystemMessage

# from .retriever import retrieve_company_context

# from .tools import (
#     get_cart_contents,
#     get_customer_orders,
#     get_payment_status,
#     search_product,
#     fuzzy_match_product,
#     ALL_PRODUCT_NAMES,
# )

# from .prompt import SYSTEM_PROMPT

# from .llm import llm


# # ==========================================
# # RAG KEYWORDS
# # These are company/policy/document questions.
# # Keep this before transactional routing so
# # "refund policy" does not become payments.
# # ==========================================
# RAG_KEYWORDS = [
#     "about smartretail",
#     "smartretailai",
#     "company",
#     "policy",
#     "policies",
#     "faq",
#     "support hours",
#     "human agent",
#     "customer support",
#     "return policy",
#     "returns",
#     "return process",
#     "refund policy",
#     "refund process",
#     "refund timeline",
#     "cancellation",
#     "cancel policy",
#     "shipping",
#     "shipping policy",
#     "standard shipping",
#     "express shipping",
#     "delivery policy",
#     "loyalty",
#     "loyalty program",
#     "warranty",
# ]


# # ==========================================
# # ROUTER NODE
# # Determines intent from the user's message.
# # Order of checks matters — cart/orders/
# # payments before products before RAG.
# # ==========================================
# def router_node(state):

#     query = state["query"].lower()

#     # ---------------------------
#     # COMPANY INFO / POLICIES
#     # ---------------------------
#     if any(word in query for word in RAG_KEYWORDS):
#         intent = "rag"

#     # ---------------------------
#     # CART
#     # ---------------------------
#     elif any(word in query for word in [
#         "cart",
#         "my cart",
#         "shopping cart",
#         "items in cart",
#         "what's in my cart",
#         "whats in my cart",
#         "cart contents",
#         "cart total",
#         "added to cart",
#         "in my basket",
#     ]):
#         intent = "cart"

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     elif any(word in query for word in [
#         "my order",
#         "my orders",
#         "order status",
#         "track",
#         "tracking",
#         "delivery",
#         "shipped",
#         "dispatch",
#         "what did i order",
#         "past order",
#         "purchase history",
#         "i ordered",
#         "placed order",
#     ]):
#         intent = "orders"

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif any(word in query for word in [
#         "payment",
#         "refund",
#         "transaction",
#         "paid",
#         "billing",
#         "invoice",
#         "receipt",
#         "charge",
#     ]):
#         intent = "payments"

#     # ---------------------------
#     # PRODUCTS
#     # Catches product names + shopping intent.
#     # ---------------------------
#     elif any(word in query for word in (
#         [
#             "product", "price", "cost",
#             "stock", "available", "availability",
#             "do you have", "do you sell",
#             "sell", "buy", "purchase",
#             "how much", "show me", "looking for",
#             "want to buy", "i need",
#         ] + ALL_PRODUCT_NAMES
#     )):
#         intent = "products"

#     # ---------------------------
#     # FUZZY FALLBACK FOR PRODUCTS
#     # Catches misspelled product names that
#     # didn't match the keyword list above.
#     # e.g. "smartfone" → fuzzy → "smartphone"
#     # ---------------------------
#     elif fuzzy_match_product(query) != query.strip():
#         intent = "products"

#     # ---------------------------
#     # COMPANY INFO (RAG)
#     # Everything else: policies, support,
#     # hours, returns, FAQs, etc.
#     # ---------------------------
#     else:
#         intent = "rag"

#     return {
#         **state,
#         "intent": intent
#     }


# # ==========================================
# # RAG NODE
# # Answers company/policy questions using
# # documents retrieved from Pinecone.
# # ==========================================
# def rag_node(state):

#     query = state["query"]

#     context = retrieve_company_context(query)

#     messages = [

#         SystemMessage(content=SYSTEM_PROMPT),

#         HumanMessage(content=(
#             f"COMPANY INFORMATION:\n{context}\n\n"
#             f"USER QUESTION:\n{query}\n\n"
#             f"ANSWER:"
#         ))
#     ]

#     response = llm.invoke(messages)

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }


# # ==========================================
# # TOOL NODE
# # Calls the right DB tool based on intent,
# # then sends the result to the LLM to form
# # a natural language answer.
# # ==========================================
# def tool_node(state):

#     intent      = state["intent"]
#     customer_id = state["customer_id"]
#     query       = state["query"]

#     # ---------------------------
#     # CART
#     # ---------------------------
#     if intent == "cart":

#         tool_result = get_cart_contents(customer_id)

#     # ---------------------------
#     # ORDERS
#     # ---------------------------
#     elif intent == "orders":

#         tool_result = get_customer_orders(customer_id)

#     # ---------------------------
#     # PAYMENTS
#     # ---------------------------
#     elif intent == "payments":

#         tool_result = get_payment_status(customer_id)

#     # ---------------------------
#     # PRODUCTS  (with fuzzy match)
#     # ---------------------------
#     elif intent == "products":

#         search_term = fuzzy_match_product(query)
#         tool_result = search_product(search_term)

#     else:

#         tool_result = "No matching tool found."

#     # ----------------------------------
#     # SEND RESULT TO LLM
#     # ----------------------------------
#     messages = [

#         SystemMessage(content=SYSTEM_PROMPT),

#         HumanMessage(content=(
#             f"TOOL RESULT:\n{tool_result}\n\n"
#             f"USER QUESTION:\n{query}\n\n"
#             f"ANSWER:"
#         ))
#     ]

#     response = llm.invoke(messages)

#     return {
#         **state,
#         "messages": [response],
#         "response": response.content
#     }

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