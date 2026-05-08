from agent.qa_Agent.agent import ask_qa_agent

print("\n===================================")
print(" SMART RETAIL QA AGENT ")
print("===================================\n")

while True:

    question = input("Ask Question: ")

    if question.lower() == "exit":
        break

    response = ask_qa_agent(

        query=question,

        customer_id=1
    )

    print("\nRESPONSE:\n")

    print(response)

    print("\n-----------------------------------\n")