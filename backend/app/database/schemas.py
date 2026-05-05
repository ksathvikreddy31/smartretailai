from pydantic import BaseModel, Field

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

# -------- PRODUCT --------
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Product Name")
    price: float = Field(..., gt=0, description="Product Price")

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float

    class Config:
        from_attributes = True