from sqlalchemy.orm import Session

from app.database.db import SessionLocal

from agent.analytics_agent.agent import (
    AnalyticsAgent
)

# ==========================================
# DATABASE SESSION
# ==========================================
db: Session = SessionLocal()

# ==========================================
# LOAD AGENT
# ==========================================
agent = AnalyticsAgent()

print("\n===================================")
print(" SMART RETAIL ANALYTICS AGENT ")
print("===================================\n")

# ==========================================
# TEST QUESTIONS
# ==========================================
questions = [

    "Show total sales",

    "How many orders do we have?",

    "What are the top selling products?",

    "Show low stock products",

    "Which products need restocking?",

    "Show pending restock requests",

    "Analyze sales trends",

    "How many users are registered?",

    "Give overall business insights"
]

# ==========================================
# RUN TESTS
# ==========================================
for i, question in enumerate(questions, start=1):

    print("\n===================================")

    print(f"TEST {i}")

    print("===================================\n")

    print(f"QUESTION:\n{question}\n")

    try:

        response = agent.run(

            query=question,

            db=db
        )

        print("AI SUMMARY:\n")

        print(response["summary"])

        print("\n-----------------------------------")

        print("ANALYTICS DATA:\n")

        analytics = response["analytics"]

        for key, value in analytics.items():

            print(f"{key}: {value}")

    except Exception as e:

        print("\nERROR:\n")

        print(str(e))

# ==========================================
# CLOSE DB
# ==========================================
db.close()

print("\n===================================")
print(" TESTING COMPLETED ")
print("===================================\n")