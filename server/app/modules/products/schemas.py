from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Product(BaseModel):
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


class ProductResponse(Product):
    id: int
    average_rating: float
    total_rating: int

class ProductRating(BaseModel):
    product_id: int
    rating: float
    comment: Optional[str]
    created_at: Optional[datetime]

    class Config:
        validate_by_name = True
        from_attributes = True

class ProductRatingResponse(ProductRating):
    id: int
    user_id: int
    user_name: str = None

class SearchProduct(BaseModel):
    query: Optional[str] = None
    categories: Optional[list[str]] = None
    min_price: float = 0
    max_price: float = 1e10

    class Config:
        validate_by_name = True
        from_attributes = True
     