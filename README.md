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

# 🔑 Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET_KEY=

AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=

PINECONE_API_KEY=
PINECONE_INDEX_NAME=

AZURE_STORAGE_CONNECTION_STRING=
```

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

![Logs](screenshots/warehouseadmin/logs.png)

---

## User Management

![Users](screenshots/warehouseadmin/users.png)

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
