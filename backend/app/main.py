from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    auth_routes,
    product_routes,
    user_routes,
    retail_routes,
    warehouse_routes,
    ai_routes
)

app = FastAPI(title="Smart Retail AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Smart Retail AI Backend Running 🚀"}

app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(product_routes.router, prefix="/products", tags=["Products"])
app.include_router(user_routes.router, prefix="/user", tags=["User Dashboard"])
app.include_router(retail_routes.router, prefix="/retail", tags=["Retail Dashboard"])
app.include_router(warehouse_routes.router, prefix="/warehouse", tags=["Warehouse Dashboard"])
app.include_router(ai_routes.router, prefix="/ai", tags=["AI Engine"])

if __name__ == "__main__":
    import uvicorn
    # explicitly bind to 8001 to avoid Errno 10048 conflicts on 8000
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)