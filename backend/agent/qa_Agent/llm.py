import os

from dotenv import load_dotenv

from langchain_openai import AzureChatOpenAI

# ==========================================
# LOAD ENV
# ==========================================
load_dotenv()

# ==========================================
# AZURE OPENAI LLM
# ==========================================
llm = AzureChatOpenAI(

    azure_endpoint=os.getenv(
        "AZURE_OPENAI_ENDPOINT"
    ),

    api_key=os.getenv(
        "AZURE_OPENAI_API_KEY"
    ),

    api_version=os.getenv(
        "AZURE_OPENAI_API_VERSION"
    ),

    deployment_name=os.getenv(
        "AZURE_OPENAI_DEPLOYMENT_NAME"
    ),

    temperature=0.3
)