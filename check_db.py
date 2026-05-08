import sqlite3
import os

db_path = "backend/smart_retail.db"
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    # try looking in the current directory if it's there
    db_path = "smart_retail.db"
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("--- Warehouse Products ---")
cursor.execute("SELECT * FROM warehouse_products")
rows = cursor.fetchall()
for row in rows:
    print(row)

print("\n--- Retailer Products ---")
cursor.execute("SELECT * FROM retailer_products")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
