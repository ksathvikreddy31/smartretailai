import os
import sys
import pandas as pd

# Add the parent directory to sys.path to allow importing from 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.db import engine

df = pd.read_csv(
    r"C:\Users\ksath\smartretailsystem\retail_project_training_dataset.csv" 
)

df.to_sql(
    "sales",
    engine,
    if_exists="append",
    index=False
)

print("Sales dataset imported successfully")