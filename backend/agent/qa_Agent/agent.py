
from .graph import graph
from .tools import fuzzy_match_product
from agent.domain_guard import (
    OFF_DOMAIN_RESPONSE,
    is_customer_domain_query
)


# ==========================================
# MAIN QA AGENT
# ==========================================
def ask_qa_agent(
    query: str,
    customer_id: int
):

    if not is_customer_domain_query(query) and not fuzzy_match_product(query):
        return OFF_DOMAIN_RESPONSE

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
