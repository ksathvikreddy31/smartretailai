OFF_DOMAIN_RESPONSE = (
    "I can only help with SmartRetailAI questions related to products, "
    "orders, cart, payments, shipping, refunds, loyalty, inventory, sales "
    "analytics, forecasting, anomalies, and restocking."
)

GREETING_KEYWORDS = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "help",
    "what can you do",
    "who are you",
]

CUSTOMER_DOMAIN_KEYWORDS = [
    "smartretail",
    "smartretailai",
    "product",
    "products",
    "price",
    "cost",
    "stock",
    "available",
    "availability",
    "buy",
    "purchase",
    "shop",
    "store",
    "catalog",
    "cart",
    "basket",
    "order",
    "orders",
    "track",
    "tracking",
    "delivery",
    "shipping",
    "refund",
    "return",
    "cancel",
    "payment",
    "transaction",
    "invoice",
    "receipt",
    "billing",
    "loyalty",
    "warranty",
    "support",
    "policy",
    "policies",
    "electronics",
    "fashion",
    "health",
    "home",
    "kitchen",
]

RETAIL_DOMAIN_KEYWORDS = CUSTOMER_DOMAIN_KEYWORDS + [
    "analytics",
    "sales",
    "report",
    "summary",
    "business",
    "profit",
    "performance",
    "inventory",
    "revenue",
    "forecast",
    "forecasting",
    "prediction",
    "predict",
    "demand",
    "trend",
    "trending",
    "anomaly",
    "abnormal",
    "spike",
    "suspicious",
    "restock",
    "restocking",
    "low stock",
    "top products",
    "dashboard",
    "retailer",
]


def _contains_keyword(query: str, keywords: list[str]) -> bool:
    normalized = query.lower().strip()
    return any(keyword in normalized for keyword in keywords)


def is_greeting_or_help(query: str) -> bool:
    normalized = query.lower().strip()
    if len(normalized.split()) > 6:
        return False

    return _contains_keyword(normalized, GREETING_KEYWORDS)


def is_customer_domain_query(query: str) -> bool:
    return is_greeting_or_help(query) or _contains_keyword(
        query,
        CUSTOMER_DOMAIN_KEYWORDS
    )


def is_retail_domain_query(query: str) -> bool:
    return is_greeting_or_help(query) or _contains_keyword(
        query,
        RETAIL_DOMAIN_KEYWORDS
    )
