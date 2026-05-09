import os
from pathlib import Path
from dotenv import load_dotenv

from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_pinecone import PineconeVectorStore

from pinecone import Pinecone, ServerlessSpec
from rag.embeddings import EMBEDDING_DIMENSION, get_embeddings

# ==========================================
# LOAD ENV
# ==========================================
BASE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = BASE_DIR.parent

load_dotenv(BACKEND_DIR / ".env")
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")

if not PINECONE_API_KEY:
    raise RuntimeError("PINECONE_API_KEY is not configured.")

if not PINECONE_INDEX:
    raise RuntimeError("PINECONE_INDEX is not configured.")

# ==========================================
# INIT EMBEDDINGS
# ==========================================
embeddings = get_embeddings()

# ==========================================
# LOAD DOCUMENTS
# ==========================================
DOCS_PATH = BASE_DIR / "documents"

documents = []

for file in os.listdir(DOCS_PATH):

    if file.endswith(".txt"):

        loader = TextLoader(
            str(DOCS_PATH / file),
            encoding="utf-8"
        )

        documents.extend(loader.load())

print(f"Loaded {len(documents)} documents")

# ==========================================
# SPLIT DOCUMENTS
# ==========================================
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)

print(f"Created {len(docs)} chunks")

# ==========================================
# PINECONE INIT
# ==========================================
pc = Pinecone(api_key=PINECONE_API_KEY)

existing_indexes = [i["name"] for i in pc.list_indexes()]

if PINECONE_INDEX not in existing_indexes:

    pc.create_index(
        name=PINECONE_INDEX,
        dimension=EMBEDDING_DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

    print("Pinecone index created")

else:

    index_info = pc.describe_index(PINECONE_INDEX)
    index_dimension = getattr(index_info, "dimension", None)

    if index_dimension and index_dimension != EMBEDDING_DIMENSION:
        raise RuntimeError(
            f"Pinecone index '{PINECONE_INDEX}' has dimension "
            f"{index_dimension}, but the embedding model requires "
            f"{EMBEDDING_DIMENSION}. Use a new index or recreate it."
        )

# ==========================================
# PUSH TO PINECONE
# ==========================================
vectorstore = PineconeVectorStore.from_documents(
    documents=docs,
    embedding=embeddings,
    index_name=PINECONE_INDEX
)

print("Documents uploaded successfully")
