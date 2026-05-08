from agent.forecast_agent.agent import (
    ForecastAgent
)

from app.database.db import (
    SessionLocal
)

# ======================================
# DB SESSION
# ======================================
db = SessionLocal()

# ======================================
# CREATE AGENT
# ======================================
agent = ForecastAgent()

# ======================================
# ASK QUESTION
# ======================================
response = agent.run(

    query="""

    Will smartphone demand
    increase next month?

    """,

    retailer_id=2,

    db=db
)

# ======================================
# PRINT RESPONSE
# ======================================
print("\n========================")
print("FORECAST AGENT RESPONSE")
print("========================\n")

print(response)