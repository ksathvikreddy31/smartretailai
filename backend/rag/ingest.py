import os
from dotenv import load_dotenv

from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_huggingface import HuggingFaceEmbeddings

from langchain_pinecone import PineconeVectorStore

from pinecone import Pinecone, ServerlessSpec

# ==========================================
# LOAD ENV
# ==========================================
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")

# ==========================================
# INIT EMBEDDINGS
# ==========================================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ==========================================
# LOAD DOCUMENTS
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DOCS_PATH = os.path.join(BASE_DIR, "documents")

documents = []

for file in os.listdir(DOCS_PATH):

    if file.endswith(".txt"):

        loader = TextLoader(
            os.path.join(DOCS_PATH, file),
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
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

    print("Pinecone index created")

# ==========================================
# PUSH TO PINECONE
# ==========================================
vectorstore = PineconeVectorStore.from_documents(
    documents=docs,
    embedding=embeddings,
    index_name=PINECONE_INDEX
)

print("Documents uploaded successfully")