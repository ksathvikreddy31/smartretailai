# from langgraph.graph import StateGraph

# from typing import TypedDict


# class AgentState(TypedDict):

#     query: str

#     role: str

#     user_id: int

#     response: str


# graph = StateGraph(AgentState)

from langgraph.graph import StateGraph

from typing import TypedDict


# ==========================================
# AGENT STATE
# ==========================================
class AgentState(TypedDict):

    query: str

    role: str

    user_id: int

    db: object

    agent_name: str

    response: dict


# ==========================================
# GRAPH DEFINITION
# (Fully assembled in orchestrator.py)
# This module exposes the state schema for
# use by other modules or for extension.
# ==========================================
graph = StateGraph(AgentState)