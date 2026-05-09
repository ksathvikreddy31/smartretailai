import os
import re
from pathlib import Path

from dotenv import load_dotenv

from langchain_pinecone import PineconeVectorStore
from rag.embeddings import get_embeddings


# ==========================================
# PATHS / ENV
# ==========================================
QA_DIR = Path(__file__).resolve().parent
BACKEND_DIR = QA_DIR.parents[1]
RAG_DOCUMENTS_DIR = BACKEND_DIR / "rag" / "documents"

# load_dotenv() depends on the current working directory. In local runs the
# process often starts from the repo root, while Docker starts from /app.
load_dotenv(BACKEND_DIR / ".env")
load_dotenv()

PINECONE_INDEX = os.getenv("PINECONE_INDEX")

_retriever = None


# ==========================================
# PINECONE RETRIEVER
# ==========================================
def _get_retriever():

    global _retriever

    if _retriever is not None:
        return _retriever

    if not PINECONE_INDEX:
        raise RuntimeError("PINECONE_INDEX is not configured.")

    embeddings = get_embeddings()

    vectorstore = PineconeVectorStore(
        index_name=PINECONE_INDEX,
        embedding=embeddings
    )

    _retriever = vectorstore.as_retriever(
        search_kwargs={"k": 4}
    )

    return _retriever


# ==========================================
# LOCAL DOCUMENT FALLBACK
# Used when Pinecone is not configured,
# unreachable, or has no matching chunks.
# ==========================================
def _tokenize(text: str):

    return set(re.findall(r"[a-z0-9]+", text.lower()))


def _retrieve_from_local_documents(query: str):

    query_tokens = _tokenize(query)

    if not query_tokens or not RAG_DOCUMENTS_DIR.exists():
        return ""

    scored_docs = []

    for path in RAG_DOCUMENTS_DIR.glob("*.txt"):

        content = path.read_text(encoding="utf-8", errors="ignore")
        tokens = _tokenize(content)

        score = len(query_tokens & tokens)

        if score:
            scored_docs.append((score, path.name, content.strip()))

    scored_docs.sort(reverse=True)

    return "\n\n".join(
        content for _, _, content in scored_docs[:4]
    )


# ==========================================
# RETRIEVE COMPANY CONTEXT
# ==========================================
def retrieve_company_context(query: str):

    try:

        docs = _get_retriever().invoke(query)

        if docs:
            return "\n\n".join(
                doc.page_content for doc in docs
            )

    except Exception as exc:

        print("RAG Pinecone retrieval failed:", exc)

    local_context = _retrieve_from_local_documents(query)

    if local_context:
        return local_context

    return "No relevant company information found."
