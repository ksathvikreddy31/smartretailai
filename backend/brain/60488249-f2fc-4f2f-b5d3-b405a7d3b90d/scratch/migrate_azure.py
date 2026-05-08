
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD status NVARCHAR(50) DEFAULT 'Active'"))
            print("Added status column")
        except Exception as e:
            print(f"Error adding status: {e}")
            
        try:
            conn.execute(text("ALTER TABLE users ADD created_at DATETIME DEFAULT GETDATE()"))
            print("Added created_at column")
        except Exception as e:
            print(f"Error adding created_at: {e}")
            
        conn.commit()
else:
    print("DATABASE_URL not found in .env")
