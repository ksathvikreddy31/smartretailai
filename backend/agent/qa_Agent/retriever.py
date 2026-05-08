import os

from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEmbeddings

from langchain_pinecone import PineconeVectorStore

# ==========================================
# LOAD ENV
# ==========================================
load_dotenv()

PINECONE_INDEX = os.getenv("PINECONE_INDEX")

# ==========================================
# EMBEDDING MODEL
# ==========================================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ==========================================
# VECTOR STORE
# ==========================================
vectorstore = PineconeVectorStore(
    index_name=PINECONE_INDEX,
    embedding=embeddings
)

# ==========================================
# RETRIEVER
# ==========================================
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}
)

# ==========================================
# RETRIEVE COMPANY CONTEXT
# ==========================================
def retrieve_company_context(query: str):

    docs = retriever.invoke(query)

    if not docs:
        return "No relevant company information found."

    context = "\n\n".join([
        doc.page_content for doc in docs
    ])

    return context