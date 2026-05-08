# from .graph import graph

# # ==========================================
# # MAIN QA AGENT
# # ==========================================
# def ask_qa_agent(
#     query: str,
#     customer_id: int
# ):

#     result = graph.invoke({

#         "query": query,

#         "customer_id": customer_id,

#         "intent": "",

#         "response": ""
#     })

#     return result["response"]

from .graph import graph


# ==========================================
# MAIN QA AGENT
# ==========================================
def ask_qa_agent(
    query: str,
    customer_id: int
):

    result = graph.invoke({

        "query": query,

        "customer_id": customer_id,

        "intent": "",

        "messages": [],

        "response": ""
    })

    return result["response"]
# ✅ THIS FILE ENDS HERE.
# Do NOT add router or graph code here.