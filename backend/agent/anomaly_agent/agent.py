import os

import pandas as pd

from sqlalchemy import text

from sklearn.ensemble import IsolationForest

from openai import AzureOpenAI


class AnomalyAgent:

    def __init__(self):

        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

    # =========================
    # LOAD ORDER DATA
    # =========================

    def load_order_data(
        self,
        db
    ):

        query = text("""

            SELECT
                order_id,
                total_amount,
                payment_status,
                order_date

            FROM orders

        """)

        rows = db.execute(query).fetchall()

        df = pd.DataFrame(
            rows,
            columns=[
                "order_id",
                "total_amount",
                "payment_status",
                "order_date"
            ]
        )

        return df

    # =========================
    # DETECT SALES ANOMALIES
    # =========================

    def detect_sales_anomalies(
        self,
        df
    ):

        if len(df) < 10:

            return []

        model = IsolationForest(
            contamination=0.05,
            random_state=42
        )

        df["anomaly"] = model.fit_predict(
            df[["total_amount"]]
        )

        anomalies = df[
            df["anomaly"] == -1
        ]

        results = []

        for _, row in anomalies.iterrows():

            results.append({
                "order_id": int(row["order_id"]),
                "total_amount": float(row["total_amount"]),
                "payment_status": row["payment_status"],
                "order_date": str(row["order_date"])
            })

        return results

    # =========================
    # FAILED PAYMENTS
    # =========================

    def detect_failed_payments(
        self,
        db
    ):

        query = text("""

            SELECT
                order_id,
                total_amount,
                order_date

            FROM orders

            WHERE payment_status='failed'

        """)

        rows = db.execute(query).fetchall()

        return [
            {
                "order_id": r[0],
                "total_amount": float(r[1]),
                "order_date": str(r[2])
            }
            for r in rows
        ]

    # =========================
    # LOW STOCK RISKS
    # =========================

    def detect_inventory_risks(
        self,
        db
    ):

        query = text("""

            SELECT
                product_id,
                rice_type,
                stock_quantity

            FROM products

            WHERE stock_quantity < 20

        """)

        rows = db.execute(query).fetchall()

        return [
            {
                "product_id": r[0],
                "rice_type": r[1],
                "stock_quantity": r[2]
            }
            for r in rows
        ]

    # =========================
    # MAIN RUN
    # =========================

    def run(
        self,
        query,
        db
    ):

        orders_df = self.load_order_data(db)

        sales_anomalies = self.detect_sales_anomalies(
            orders_df
        )

        failed_payments = self.detect_failed_payments(
            db
        )

        inventory_risks = self.detect_inventory_risks(
            db
        )

        anomaly_context = f"""

        Sales Anomalies:
        {sales_anomalies}

        Failed Payments:
        {failed_payments}

        Inventory Risks:
        {inventory_risks}

        """

        response = self.client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
            messages=[
                {
                    "role": "system",
                    "content": """

                    You are an AI anomaly detection assistant.

                    Analyze:
                    - abnormal sales
                    - suspicious transactions
                    - failed payments
                    - inventory risks
                    - unusual order patterns

                    Give concise risk insights.

                    """
                },
                {
                    "role": "user",
                    "content": f"""

                    User Query:
                    {query}

                    Detected Anomalies:
                    {anomaly_context}

                    """
                }
            ]
        )

        return {
            "summary": response.choices[0].message.content,
            "anomalies": {
                "sales_anomalies": sales_anomalies,
                "failed_payments": failed_payments,
                "inventory_risks": inventory_risks
            }
        }