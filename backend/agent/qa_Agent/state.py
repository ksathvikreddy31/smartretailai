# from typing import TypedDict

# class AgentState(TypedDict):

#     query: str

#     customer_id: int

#     intent: str

#     response: str

from typing import TypedDict, Annotated
import operator


# ==========================================
# AGENT STATE
# ==========================================
class AgentState(TypedDict):

    query: str

    customer_id: int

    intent: str

    messages: Annotated[list, operator.add]

    response: str