from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

# -------- CATEGORY CONSTANTS --------
class ProductCategory(str, Enum):
    ELECTRONICS = "Consumer Electronics"
    FASHION = "Fashion & Apparel"
    HEALTH = "Health & Personal Care"
    HOME = "Home & Kitchen Essentials"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "Credit Card"
    UPI = "UPI"
    QR_CODE = "QR Code"
    CASH_ON_DELIVERY = "Cash on Delivery"

# -------- USER --------
class UserCreate(BaseModel):
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=6, description="Strong password required")
    role: str = Field("user", description="Role: user, retail, admin")

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True

# -------- WAREHOUSE PRODUCTS (Master Stock) --------
class WarehouseProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    quantity: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
    category: ProductCategory = ProductCategory.ELECTRONICS

class WarehouseProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    image_url: Optional[str] = None
    category: Optional[ProductCategory] = None

class WarehouseProductResponse(WarehouseProductCreate):
    id: int
    
    class Config:
        from_attributes = True

# -------- RETAILER PRODUCTS (Specific Store Stock) --------
class RetailerProductCreate(BaseModel):
    name: str
    price: float
    quantity: int
    image_url: Optional[str] = None
    retailer_id: int
    category: ProductCategory = ProductCategory.ELECTRONICS

class RetailerProductResponse(RetailerProductCreate):
    id: int
    retailer_name: Optional[str] = None

    class Config:
        from_attributes = True

# -------- LOGS --------
class LogResponse(BaseModel):
    id: int
    action: str
    details: Optional[str] = None
    timestamp: datetime 

    class Config:
        from_attributes = True

# -------- MESSAGES --------
class MessageCreate(BaseModel):
    receiver_id: int = Field(..., description="Admin user ID to receive message")
    content: str = Field(..., min_length=1, max_length=1000)

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# -------- RESTOCK REQUESTS --------
class RestockRequestCreate(BaseModel):
    warehouse_product_id: int = Field(..., description="Product ID from warehouse")
    requested_quantity: int = Field(..., gt=0, description="Quantity to restock")
    message: Optional[str] = Field(None, max_length=500)

class RestockRequestUpdate(BaseModel):
    status: Optional[str] = None  
    admin_notes: Optional[str] = None

class RestockRequestResponse(BaseModel):
    id: int
    retailer_id: int
    warehouse_product_id: int
    requested_quantity: int
    message: Optional[str] = None
    status: str
    admin_notes: Optional[str] = None
    retailer_name: Optional[str] = None
    retailer_email: Optional[str] = None
    product_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# -------- CART ITEMS --------
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)

class CartItemResponse(CartItemBase):
    id: int
    user_id: int
    product_name: Optional[str] = None
    product_price: Optional[float] = None
    product_image_url: Optional[str] = None
    retailer_id: Optional[int] = None
    retailer_name: Optional[str] = None

    class Config:
        from_attributes = True

# -------- ORDERS & PAYMENTS --------
class PaymentInfo(BaseModel):
    method: PaymentMethod
    card_number: Optional[str] = None
    card_expiry: Optional[str] = None
    card_cvv: Optional[str] = None
    upi_id: Optional[str] = None
    
class CheckoutRequest(BaseModel):
    payment_info: PaymentInfo
    shipping_address: str
    city: str
    zip_code: str

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    price_at_purchase: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    retailer_id: int
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    amount: float
    status: str
    method: str
    timestamp: datetime

    class Config:
        from_attributes = True

class CheckoutResponse(BaseModel):
    message: str
    order_ids: List[int]
    total_amount: float

# -------- AI & ANALYTICS --------
class AIProductResponse(BaseModel):
    product_id: int
    category: str
    product_name: str
    price: float
    stock: int
    class Config: from_attributes = True

# class SaleResponse(BaseModel):
    # sale_id: int
    # date: date
    # product_id: int
    # category: str
    # product_name: str
    # quantity_sold: int
    # price: float
    # revenue: float
    # warehouse: str
    # supplier: str
    # discount: float
    # customer_region: str
    # class Config: from_attributes = True
class SaleResponse(BaseModel):

    sale_id: int

    date: date

    store_id: Optional[str]

    product_id: str

    category: str

    product_name: str

    quantity_sold: int

    price: float

    revenue: float

    cost: float

    profit: float

    stock_level: int

    discount_pct: float

    rolling_avg_7: float

    rolling_avg_30: float

    warehouse: str

    supplier: str

    customer_region: str

    class Config:
        from_attributes = True
class ForecastResponse(BaseModel):
    id: int
    forecast_date: date
    predicted_sales: float
    class Config: from_attributes = True

class AnomalyResponse(BaseModel):
    id: int
    product_name: str
    issue: str
    severity: str
    class Config: from_attributes = True