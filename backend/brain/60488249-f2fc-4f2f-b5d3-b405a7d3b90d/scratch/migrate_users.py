
import sqlite3
import os

db_path = "backend/smart_retail.db"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'Active'")
        print("Added status column to users table")
    except sqlite3.OperationalError:
        print("status column already exists or table doesn't exist")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
        print("Added created_at column to users table")
    except sqlite3.OperationalError:
        print("created_at column already exists or table doesn't exist")
        
    conn.commit()
    conn.close()
else:
    print(f"Database {db_path} not found")
