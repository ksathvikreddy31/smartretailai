# 🛒 Smart Retail AI

## Intelligent Retail Management & Forecasting Platform

Smart Retail AI is a full-stack AI-powered retail management system that combines:

- Multi-Agent AI using LangGraph
- Retrieval-Augmented Generation (RAG)
- Demand Forecasting
- Anomaly Detection
- Azure OpenAI Integration
- Role-Based Retail Workflows
- Cloud Deployment with Docker & Azure

---

# 🚀 Features

## 👥 Role-Based Portals

### Customer Portal

- Browse products
- Add to cart
- Checkout system
- View orders
- AI chatbot support

### Retailer Portal

- Manage products
- View analytics
- Forecast demand
- Restock requests
- Retail AI assistant

### Admin Portal

- Warehouse inventory management
- Approve retailer requests
- Dispatch inventory
- Manage users
- Monitor platform logs

---

# 🤖 AI Capabilities

## Multi-Agent AI System

The platform uses LangGraph orchestration with specialized AI agents:

| Agent              | Purpose                             |
| ------------------ | ----------------------------------- |
| QA Agent           | Customer support & policy questions |
| Analytics Agent    | Sales & inventory insights          |
| Retail ML Agent    | Forecasting & anomaly detection     |
| Orchestrator Agent | Routes queries to correct AI agent  |

---

# 🧠 RAG (Retrieval-Augmented Generation)

- Pinecone Vector Database
- Azure/OpenAI Embeddings
- Company policy retrieval
- Semantic search
- Local document fallback support

---

# 📈 Machine Learning Features

## Demand Forecasting

- 7-day sales forecasting
- 30-day demand prediction
- Prophet forecasting models

## Anomaly Detection

- Detect abnormal sales activity
- Identify unusual inventory patterns
- ML-powered analytics alerts

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Tailwind CSS
- Framer Motion
- React Router

## Backend

- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic

## AI & ML

- LangGraph
- LangChain
- Azure OpenAI
- Pinecone
- Prophet
- Scikit-learn
- XGBoost

## Database & Cloud

- SQLite
- Azure SQL Compatible
- Azure Blob Storage

## Deployment

- Docker
- Azure App Service

---

# 🏗️ System Architecture

```text
Frontend (React)
        ↓
FastAPI Backend
        ↓
Authentication Layer
        ↓
LangGraph Multi-Agent System
        ↓
RAG + ML Services
        ↓
Database + Azure Services
```

---

# 🔐 Authentication & Security

- JWT Token Authentication
- Password Hashing using bcrypt
- Role-Based Access Control
- Protected Routes
- Environment Variable Secrets
- Azure SAS URL Security

---

# 📡 REST API Endpoints

## Authentication

```http
POST /auth/register
POST /auth/login
```

## AI

```http
POST /ai/chat
POST /ai/retail-chat
GET  /ai/forecast
```

## Orders

```http
POST /orders/checkout
GET  /orders/my-orders
```

## Products

```http
GET /products/warehouse
GET /products/retailer
```

---

# ☁️ Azure Integration

- Azure OpenAI
- Azure Blob Storage
- Azure SQL Compatibility
- Azure App Service Deployment

---

# 🐳 Docker Deployment

## Build Docker Image

```bash
docker build -t smart-retail-ai .
```

## Run Container

```bash
docker run -p 8000:8000 smart-retail-ai
```

---

# 📂 Project Structure

```text
SmartRetailAI/
│
├── frontend/
├── backend/
├── rag/
├── ml/
├── docker/
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/ksathvikreddy31/smartretailai.git
cd smartretailai
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# 🔑 Environment Variables Setup

Create a `.env` file inside the backend folder and configure the following environment variables.

## Database Configuration

```env
DATABASE_URL=mssql+pyodbc://<USERNAME>:<PASSWORD>@<SERVER>.database.windows.net/<DATABASE_NAME>?driver=ODBC+Driver+18+for+SQL+Server&Encrypt=yes&TrustServerCertificate=no&Connection+Timeout=30
```

---

## JWT Security Configuration

```env
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Pinecone Configuration

```env
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index
```

---

## Azure OpenAI Configuration

```env
AZURE_OPENAI_API_KEY=your_azure_openai_api_key

AZURE_OPENAI_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/

AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name

AZURE_OPENAI_API_VERSION=2024-12-01-preview
```

---

## Embedding Configuration

```env
OPENAI_EMBEDDING_PROVIDER=azure

AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-3-large

OPENAI_EMBEDDING_MODEL=text-embedding-3-large

OPENAI_EMBEDDING_DIMENSION=3072
```

---

## Azure Blob Storage Configuration

```env
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string

AZURE_STORAGE_ACCOUNT=your_storage_account_name

AZURE_STORAGE_KEY=your_storage_account_key

AZURE_STORAGE_CONTAINER=your_container_name
```

---

# ⚠️ Important Security Note

❌ Never upload real `.env` files or API keys to GitHub.

✅ Always use placeholder values in public repositories.

✅ Add `.env` to `.gitignore` before pushing code.

Example:

```gitignore
.env
```

---

# 📦 Required Services

Before running the project, make sure you have configured:

- Azure OpenAI
- Pinecone Vector Database
- Azure SQL Database
- Azure Blob Storage
- Docker
- Node.js
- Python 3.11+

---

---

# 📊 Key Functionalities

✅ AI-Powered Customer Support  
✅ Retail Analytics Dashboard  
✅ Inventory Management  
✅ Demand Forecasting  
✅ Anomaly Detection  
✅ Role-Based Authentication  
✅ Azure Cloud Integration  
✅ Dockerized Deployment  
✅ Multi-Agent AI Architecture

---

# 🔮 Future Enhancements

- WebSocket Chat Streaming
- Conversation Memory
- Advanced Forecasting Models
- Automated Background Jobs
- Real-Time Notifications
- Production-Level Monitoring

---

# 📸 Screenshots

# 🔐 Authentication

## Login Page

![Login Page](screenshots/login.png)

---

## Register Page

![Register Page](screenshots/Register.png)

---

# 👤 Customer Portal

## Customer Dashboard

![Customer Dashboard](screenshots/user/Userdashboard.png)

---

## Cart Management

![Cart](screenshots/user/Cart.png)

---

## Orders

![Orders](screenshots/user/orders.png)

---

## Payments

![Payments](screenshots/user/Payments.png)

---

## Customer AI Assistant

![Customer AI Assistant](screenshots/user/useragent.png)

---

# 🏪 Retailer Portal

## Retail Dashboard

![Retail Dashboard](screenshots/retail/Retaildashboard.png)

---

## Product Management

![Products](screenshots/retail/products.png)

---

## Incoming Orders

![Incoming Orders](screenshots/retail/Incomingorders.png)

---

## Restocking Management

![Restocking](screenshots/retail/Restocking.png)

---

## Forecast Analytics

![Forecasting](screenshots/retail/Forecasting.png)

---

## Sales History

![Sales History](screenshots/retail/saleshistory.png)

---

## Retail AI Agent

![Retail AI Agent](screenshots/retail/Retailagent.png)

---

# 🛠️ Warehouse Admin Portal

## Inventory Approvals

![Approvals](screenshots/warehouseadmin/Approvals.png)

---

## Product Dispatch

![Dispatch](screenshots/warehouseadmin/dispatch.png)

---

## Warehouse Inventory

![Inventory](screenshots/warehouseadmin/inventory.png)

---

## Warehouse Logs

![Logs](screenshots/warehouseadmin/orderlogs.png)

---

## User Management

![Users](screenshots/warehouseadmin/usermanagement.png)

---

# ☁️ Azure Cloud Integration

## Azure Resource Group

![Azure Resource Group](screenshots/azure/resourcegroup.png)

---

## Azure SQL Database

![Azure SQL Database](screenshots/azure/azuredatabase.png)

---

## Azure Data Factory (ADF)

![Azure Data Factory](screenshots/azure/ADF.png)

---

## Azure ML / AI Models

![Azure Models](screenshots/azure/Models.png)

---

---

# 👨‍💻 Contributors

- Kantareddy Sathvik Reddy

---

# 📄 License

This project is developed for educational and capstone purposes under the Left Shift Program 2026.

---

# ⭐ Acknowledgements

- LangGraph
- FastAPI
- Azure OpenAI
- Pinecone
- Prophet
- React
- Docker
- Capgemini Left Shift Program
