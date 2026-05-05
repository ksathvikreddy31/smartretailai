from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL

# SQLite requires specific connect_args to allow multithreading, which FastAPI uses.
connect_args = {"check_same_thread": False} if DATABASE_URL and DATABASE_URL.startswith("sqlite") else {}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
    print("✅ Database Engine Initialized Successfully")
except Exception as e:
    print(f"❌ DATABASE CONNECTION ERROR: {e}")
    # Fallback dummy engine or allow the server to start without killing the app
    engine = None
    SessionLocal = None

# Dependency to be injected into routes
def get_db():
    if SessionLocal is None:
        raise RuntimeError("Database connection is not initialized due to a startup error.")
        
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()