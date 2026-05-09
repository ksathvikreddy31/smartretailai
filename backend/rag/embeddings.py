import os
from pathlib import Path

from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")
load_dotenv()

EMBEDDING_MODEL = os.getenv(
    "OPENAI_EMBEDDING_MODEL",
    "text-embedding-3-large"
)

EMBEDDING_DIMENSION = int(
    os.getenv("OPENAI_EMBEDDING_DIMENSION", "3072")
)


def get_embeddings():

    from langchain_openai import AzureOpenAIEmbeddings, OpenAIEmbeddings

    provider = os.getenv(
        "OPENAI_EMBEDDING_PROVIDER",
        "openai"
    ).lower()

    if provider == "azure":

        deployment = os.getenv(
            "AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME"
        )

        if not deployment:
            raise RuntimeError(
                "AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME is not configured."
            )

        return AzureOpenAIEmbeddings(
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_deployment=deployment,
            model=EMBEDDING_MODEL,
            dimensions=EMBEDDING_DIMENSION,
        )

    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    return OpenAIEmbeddings(
        model=EMBEDDING_MODEL,
        dimensions=EMBEDDING_DIMENSION,
    )
