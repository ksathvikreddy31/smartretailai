
# from fastapi import FastAPI, Request

# from fastapi.middleware.cors import (
#     CORSMiddleware
# )

# from fastapi.exceptions import (
#     RequestValidationError
# )

# from fastapi.responses import (
#     JSONResponse
# )

# from contextlib import (
#     asynccontextmanager
# )

# # =========================================
# # DATABASE
# # =========================================
# from app.database.models import Base

# from app.database.db import engine

# # =========================================
# # ROUTES
# # =========================================
# from app.routes import (

#     auth_routes,

#     product_routes,

#     user_routes,

#     retail_routes,

#     warehouse_routes,

#     ai_routes,

#     order_routes
# )

# # =========================================
# # FORECAST ROUTES
# # =========================================
# from app.routes.forecast_routes import (
#     router as forecast_router
# )

# # =========================================
# # ADMIN ROUTES
# # =========================================
# from app.routes.admin_routes import (
#     router as admin_router
# )

# # =========================================
# # APPLICATION LIFESPAN
# # =========================================
# @asynccontextmanager
# async def lifespan(app: FastAPI):

#     # -------------------------------------
#     # CREATE DATABASE TABLES
#     # -------------------------------------
#     if engine:

#         try:

#             Base.metadata.create_all(
#                 bind=engine
#             )

#             print(
#                 "[SUCCESS] Database Tables Created Successfully"
#             )

#         except Exception as e:

#             print(
#                 f"[WARNING] Database Initialization Error: {e}"
#             )

#     yield


# # =========================================
# # FASTAPI APP
# # =========================================
# app = FastAPI(

#     title="Smart Retail AI",

#     version="1.0.0",

#     lifespan=lifespan
# )

# # =========================================
# # VALIDATION ERROR HANDLER
# # =========================================
# @app.exception_handler(
#     RequestValidationError
# )
# async def validation_exception_handler(

#     request: Request,

#     exc: RequestValidationError
# ):

#     errors = exc.errors()

#     print(
#         f"[VALIDATION ERROR] "
#         f"{request.method} "
#         f"{request.url.path}"
#     )

#     for error in errors:

#         field_name = " -> ".join(

#             str(loc)

#             for loc in error['loc'][1:]
#         )

#         print(
#             f"❌ {field_name}: {error['msg']}"
#         )

#     return JSONResponse(

#         status_code=422,

#         content={

#             "detail": errors,

#             "message":
#             "Validation failed"
#         }
#     )

# # =========================================
# # CORS CONFIGURATION
# # =========================================
# app.add_middleware(

#     CORSMiddleware,

#     allow_origins=[

#         "http://localhost:3000",

#         "http://127.0.0.1:3000",

#         "http://localhost:5173",

#         "http://127.0.0.1:5173"
#     ],

#     allow_credentials=True,

#     allow_methods=["*"],

#     allow_headers=["*"],
# )

# # =========================================
# # HOME ROUTE
# # =========================================
# @app.get("/")
# def home():

#     return {

#         "message":
#         "Smart Retail AI Backend Running 🚀"
#     }

# # =========================================
# # AUTH ROUTES
# # =========================================
# app.include_router(

#     auth_routes.router,

#     prefix="/auth",

#     tags=["Auth"]
# )

# # =========================================
# # PRODUCT ROUTES
# # =========================================
# app.include_router(

#     product_routes.router,

#     prefix="/products",

#     tags=["Products"]
# )

# # =========================================
# # USER ROUTES
# # =========================================
# app.include_router(

#     user_routes.router,

#     prefix="/user",

#     tags=["User Dashboard"]
# )

# # =========================================
# # RETAIL ROUTES
# # =========================================
# app.include_router(

#     retail_routes.router,

#     prefix="/retail",

#     tags=["Retail Dashboard"]
# )

# # =========================================
# # WAREHOUSE ROUTES
# # =========================================
# app.include_router(

#     warehouse_routes.router,

#     prefix="/warehouse",

#     tags=["Warehouse Dashboard"]
# )

# # =========================================
# # AI ROUTES
# # =========================================
# app.include_router(

#     ai_routes.router,

#     prefix="/ai",

#     tags=["AI Engine"]
# )

# # =========================================
# # FORECAST ROUTES
# # =========================================
# app.include_router(

#     forecast_router,

#     prefix="/ai",

#     tags=["Demand Forecasting"]
# )

# # =========================================
# # ADMIN ROUTES
# # =========================================
# app.include_router(

#     admin_router,

#     prefix="/admin",

#     tags=["Admin Dashboard"]
# )

# # =========================================
# # ORDER ROUTES
# # =========================================
# app.include_router(

#     order_routes.router,

#     prefix="/orders",

#     tags=["Orders & Cart"]
# )

# # =========================================
# # RUN SERVER
# # =========================================
# if __name__ == "__main__":

#     import uvicorn

#     uvicorn.run(

#         "app.main:app",

#         host="127.0.0.1",

#         port=8001,

#         reload=True
#     )

from fastapi import FastAPI, Request

from fastapi.middleware.cors import (
    CORSMiddleware
)

from fastapi.exceptions import (
    RequestValidationError
)

from fastapi.responses import (
    JSONResponse
)

from contextlib import (
    asynccontextmanager
)

# =========================================
# DATABASE
# =========================================
from app.database.models import Base

from app.database.db import engine

# =========================================
# ROUTES
# =========================================
from app.routes import (

    auth_routes,

    product_routes,

    user_routes,

    retail_routes,

    warehouse_routes,

    ai_routes,

    order_routes
)

# =========================================
# FORECAST ROUTES
# =========================================
from app.routes.forecast_routes import (
    router as forecast_router
)

# =========================================
# ADMIN ROUTES
# =========================================
from app.routes.admin_routes import (
    router as admin_router
)

# =========================================
# DASHBOARD ROUTES
# =========================================
from app.routes.dashboard_routes import (
    router as dashboard_router
)

# =========================================
# APPLICATION LIFESPAN
# =========================================
@asynccontextmanager
async def lifespan(app: FastAPI):

    # -------------------------------------
    # CREATE DATABASE TABLES
    # -------------------------------------
    if engine:

        try:

            Base.metadata.create_all(
                bind=engine
            )

            print(
                "[SUCCESS] Database Tables Created Successfully"
            )

        except Exception as e:

            print(
                f"[WARNING] Database Initialization Error: {e}"
            )

    yield


# =========================================
# FASTAPI APP
# =========================================
app = FastAPI(

    title="Smart Retail AI",

    version="1.0.0",

    lifespan=lifespan
)

# =========================================
# VALIDATION ERROR HANDLER
# =========================================
@app.exception_handler(
    RequestValidationError
)
async def validation_exception_handler(

    request: Request,

    exc: RequestValidationError
):

    errors = exc.errors()

    print(
        f"[VALIDATION ERROR] "
        f"{request.method} "
        f"{request.url.path}"
    )

    for error in errors:

        field_name = " -> ".join(

            str(loc)

            for loc in error['loc'][1:]
        )

        print(
            f"❌ {field_name}: {error['msg']}"
        )

    return JSONResponse(

        status_code=422,

        content={

            "detail": errors,

            "message":
            "Validation failed"
        }
    )

# =========================================
# CORS CONFIGURATION
# =========================================
app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:3000",

        "http://127.0.0.1:3000",

        "http://localhost:5173",

        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================================
# HOME ROUTE
# =========================================
@app.get("/")
def home():

    return {

        "message":
        "Smart Retail AI Backend Running 🚀"
    }

# =========================================
# AUTH ROUTES
# =========================================
app.include_router(

    auth_routes.router,

    prefix="/auth",

    tags=["Auth"]
)

# =========================================
# PRODUCT ROUTES
# =========================================
app.include_router(

    product_routes.router,

    prefix="/products",

    tags=["Products"]
)

# =========================================
# USER ROUTES
# =========================================
app.include_router(

    user_routes.router,

    prefix="/user",

    tags=["User Dashboard"]
)

# =========================================
# RETAIL ROUTES
# =========================================
app.include_router(

    retail_routes.router,

    prefix="/retail",

    tags=["Retail Dashboard"]
)

# =========================================
# WAREHOUSE ROUTES
# =========================================
app.include_router(

    warehouse_routes.router,

    prefix="/warehouse",

    tags=["Warehouse Dashboard"]
)

# =========================================
# AI ROUTES
# =========================================
app.include_router(

    ai_routes.router,

    prefix="/ai",

    tags=["AI Engine"]
)

# =========================================
# FORECAST ROUTES
# =========================================
app.include_router(

    forecast_router,

    prefix="/ai",

    tags=["Demand Forecasting"]
)

# =========================================
# DASHBOARD ROUTES
# =========================================
app.include_router(

    dashboard_router,

    prefix="/dashboard",

    tags=["Dashboard"]
)

# =========================================
# ADMIN ROUTES
# =========================================
app.include_router(

    admin_router,

    prefix="/admin",

    tags=["Admin Dashboard"]
)

# =========================================
# ORDER ROUTES
# =========================================
app.include_router(

    order_routes.router,

    prefix="/orders",

    tags=["Orders & Cart"]
)

# =========================================
# RUN SERVER
# =========================================
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(

        "app.main:app",

        host="127.0.0.1",

        port=8001,

        reload=True
    )