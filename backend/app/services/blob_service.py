import os

from datetime import datetime, timedelta

from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions
)

# =========================================
# ENV VARIABLES
# =========================================
ACCOUNT_NAME = os.getenv("AZURE_STORAGE_ACCOUNT")

ACCOUNT_KEY = os.getenv("AZURE_STORAGE_KEY")

CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER")

CONNECTION_STRING = os.getenv(
    "AZURE_STORAGE_CONNECTION_STRING"
)

# =========================================
# BLOB CLIENT
# =========================================
blob_service_client = BlobServiceClient.from_connection_string(
    CONNECTION_STRING
)

# =========================================
# GENERATE CSV DOWNLOAD URL
# =========================================
def generate_sales_csv_url():

    # blob_name = "sales_backup.csv"
    blob_name = "dbo.sales.txt"

    sas_token = generate_blob_sas(

        account_name=ACCOUNT_NAME,

        container_name=CONTAINER_NAME,

        blob_name=blob_name,

        account_key=ACCOUNT_KEY,

        permission=BlobSasPermissions(
            read=True
        ),

        expiry=datetime.utcnow() + timedelta(hours=1)
    )

    download_url = (

        f"https://{ACCOUNT_NAME}.blob.core.windows.net/"
        f"{CONTAINER_NAME}/{blob_name}?{sas_token}"
    )

    return download_url