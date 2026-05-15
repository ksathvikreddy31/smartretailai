
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.responses import Response

from azure.storage.blob import (
    BlobServiceClient
)

from app.utils.deps import (
    get_current_user
)

import os

router = APIRouter()

# =========================================
# AZURE CONFIG
# =========================================
CONNECTION_STRING = os.getenv(
    "AZURE_STORAGE_CONNECTION_STRING"
)

CONTAINER_NAME = os.getenv(
    "AZURE_STORAGE_CONTAINER"
)

BLOB_NAME = "dbo.sales.txt"

# =========================================
# DOWNLOAD CSV
# =========================================
@router.get("/sales-csv")
def download_sales_csv(

    current_user: dict = Depends(
        get_current_user
    )
):

    try:

        # ---------------------------------
        # CONNECT TO BLOB STORAGE
        # ---------------------------------
        blob_service_client = (
            BlobServiceClient.from_connection_string(
                CONNECTION_STRING
            )
        )

        blob_client = (
            blob_service_client
            .get_blob_client(

                container=CONTAINER_NAME,

                blob=BLOB_NAME
            )
        )

        # ---------------------------------
        # DOWNLOAD TXT CONTENT
        # ---------------------------------
        blob_data = (
            blob_client
            .download_blob()
            .readall()
        )

        # ---------------------------------
        # RETURN AS CSV DOWNLOAD
        # ---------------------------------
        return Response(

            content=blob_data,

            media_type="text/csv",

            headers={

                "Content-Disposition":
                "attachment; filename=sales_backup.csv"
            }
        )

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )