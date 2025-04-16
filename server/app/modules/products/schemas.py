from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductResponse(BaseModel):
    id: str
    product_name: str
    price: Optional[float]
    description: Optional[str]
    image: Optional[str]
    category: Optional[list[str]]
    brand: Optional[str]
    size: Optional[list[str]]
    color: Optional[list[str]]
    stock: Optional[int]
    original: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        validate_by_name = True
        from_attributes = True
