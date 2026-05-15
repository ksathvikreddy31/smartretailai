
from langgraph.graph import StateGraph

from .state import AgentState

from .nodes import (
    router_node,
    rag_node,
    tool_node
)


# ==========================================
# GRAPH BUILDER
# ==========================================
builder = StateGraph(AgentState)

# ==========================================
# NODES
# ==========================================
builder.add_node(
    "router",
    router_node
)

builder.add_node(
    "rag",
    rag_node
)

builder.add_node(
    "tools",
    tool_node
)

# ==========================================
# ENTRY POINT
# ==========================================
builder.set_entry_point("router")

# ==========================================
# CONDITIONAL ROUTING
# ==========================================
def decide_route(state):

    if state["intent"] == "rag":
        return "rag"

    return "tools"


builder.add_conditional_edges(
    "router",
    decide_route
)

# ==========================================
# FINISH POINTS
# ==========================================
builder.set_finish_point("rag")

builder.set_finish_point("tools")

# ==========================================
# COMPILE
# ==========================================
graph = builder.compile()