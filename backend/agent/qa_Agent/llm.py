import os
from types import SimpleNamespace

from dotenv import load_dotenv

# ==========================================
# LOAD ENV
# ==========================================
load_dotenv()


class AzureOpenAIChatFallback:
    def __init__(self):
        from openai import AzureOpenAI

        self.client = AzureOpenAI(
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        )
        self.deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

    def invoke(self, messages):
        formatted_messages = []

        for message in messages:
            message_type = getattr(message, "type", "user")
            role = "system" if message_type == "system" else "user"
            formatted_messages.append({
                "role": role,
                "content": getattr(message, "content", str(message)),
            })

        response = self.client.chat.completions.create(
            model=self.deployment,
            messages=formatted_messages,
            temperature=0.3,
        )

        return SimpleNamespace(
            content=response.choices[0].message.content
        )


# ==========================================
# AZURE OPENAI LLM
# ==========================================
try:
    from langchain_openai import AzureChatOpenAI

    llm = AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        temperature=0.3
    )
except ModuleNotFoundError as exc:
    if exc.name != "langchain_core.pydantic_v1":
        raise

    llm = AzureOpenAIChatFallback()
