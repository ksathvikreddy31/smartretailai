
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="user", nullable=False)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    retailer_products = relationship("RetailerProduct", back_populates="retailer")
    orders = relationship("Order", back_populates="user", foreign_keys="[Order.user_id]")
    cart_items = relationship("CartItem", back_populates="user")


class WarehouseProduct(Base):
    __tablename__ = "warehouse_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0)
    image_url = Column(String(500))
    category = Column(String(100), default="Consumer Electronics", nullable=False)


class RetailerProduct(Base):
    __tablename__ = "retailer_products"

    id = Column(Integer, primary_key=True, index=True)

    retailer_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    name = Column(String(255), nullable=False)

    price = Column(Float, nullable=False)

    quantity = Column(Integer, default=0)

    image_url = Column(String(500))

    category = Column(
        String(100),
        default="Consumer Electronics",
        nullable=False
    )

    retailer = relationship(
        "User",
        back_populates="retailer_products"
    )

    cart_items = relationship(
        "CartItem",
        back_populates="product"
    )

    order_items = relationship(
        "OrderItem",
        back_populates="product"
    )


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("retailer_products.id"),
        index=True
    )

    quantity = Column(Integer, default=1)

    user = relationship(
        "User",
        back_populates="cart_items"
    )

    product = relationship(
        "RetailerProduct",
        back_populates="cart_items"
    )


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    retailer_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    total_price = Column(Float, nullable=False)

    status = Column(
        String(50),
        default="In Progress"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="orders",
        foreign_keys=[user_id]
    )

    items = relationship(
        "OrderItem",
        back_populates="order"
    )

    payment = relationship(
        "Payment",
        back_populates="order",
        uselist=False
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("retailer_products.id"),
        index=True
    )

    quantity = Column(Integer, nullable=False)

    price_at_purchase = Column(
        Float,
        nullable=False
    )

    order = relationship(
        "Order",
        back_populates="items"
    )

    product = relationship(
        "RetailerProduct",
        back_populates="order_items"
    )


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        unique=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    retailer_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    amount = Column(Float, nullable=False)

    status = Column(
        String(50),
        default="Completed"
    )

    method = Column(
        String(50),
        default="Credit Card"
    )

    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    order = relationship(
        "Order",
        back_populates="payment"
    )


class RestockRequest(Base):
    __tablename__ = "restock_requests"

    id = Column(Integer, primary_key=True, index=True)

    retailer_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    warehouse_product_id = Column(
        Integer,
        ForeignKey("warehouse_products.id"),
        index=True
    )

    requested_quantity = Column(Integer, nullable=False)

    message = Column(String(500))

    status = Column(
        String(50),
        default="Pending"
    )

    admin_notes = Column(String(500))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    retailer = relationship(
        "User",
        foreign_keys=[retailer_id]
    )

    product = relationship(
        "WarehouseProduct",
        foreign_keys=[warehouse_product_id]
    )

    @property
    def retailer_name(self):
        if self.retailer:
            return self.retailer.email.split("@")[0].capitalize()
        return "Retailer"

    @property
    def retailer_email(self):
        return self.retailer.email if self.retailer else "N/A"

    @property
    def product_name(self):
        return self.product.name if self.product else "Product"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), index=True)
    receiver_id = Column(Integer, ForeignKey("users.id"), index=True)
    content = Column(String(1000), nullable=False)
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(255), nullable=False)
    details = Column(String(1000))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class AIProduct(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True)

    category = Column(String(100))

    product_name = Column(String(255))

    price = Column(Float)

    stock = Column(Integer)


# ==========================================
# UPDATED ML-READY SALES TABLE
# ==========================================

class Sale(Base):

    __tablename__ = "sales"

    sale_id = Column(
        Integer,
        primary_key=True
    )

    date = Column(
        Date,
        nullable=False
    )

    store_id = Column(
        String(50)
    )

    product_id = Column(
    String(50),
    nullable=False
    )   

    category = Column(
        String(100)
    )

    product_name = Column(
        String(255)
    )

    quantity_sold = Column(
        Integer
    )

    price = Column(
        Float
    )

    revenue = Column(
        Float
    )

    cost = Column(
        Float
    )

    profit = Column(
        Float
    )

    stock_level = Column(
        Integer
    )

    discount_pct = Column(
        Float
    )

    rolling_avg_7 = Column(
        Float
    )

    rolling_avg_30 = Column(
        Float
    )

    warehouse = Column(
        String(100)
    )

    supplier = Column(
        String(255)
    )

    customer_region = Column(
        String(100)
    )


class ForecastPrediction(Base):
    __tablename__ = "forecast_predictions"

    id = Column(Integer, primary_key=True, index=True)

    forecast_date = Column(Date)

    predicted_sales = Column(Float)


class AnomalyAlert(Base):
    __tablename__ = "anomaly_alerts"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(255))

    issue = Column(String(255))

    severity = Column(String(50))