from fastapi import APIRouter, Query
from typing import List, Optional

from app.modules.products.schemas import ProductResponse
from app.modules.products.ProductManager import ProductManager
from app.modules.products.models import Category
from app.core.dependencies import injector
router = APIRouter()

product_manager = injector.get(ProductManager)

@router.get("/", response_model=list[ProductResponse])
def list_products():
    
    products = product_manager.getAllProduct()
    return products

@router.get("/search", response_model=List[ProductResponse])
def search_products_endpoint(
    query: Optional[str] = None,
    categories: Optional[List[str]] = Query(default=None),
    min_price: float = 0,
    max_price: float = 1e10,
):
    return product_manager.search_products(
        query=query, categories=categories, min_price=min_price, max_price=max_price
    )

@router.get("/category", response_model=List[str])
def get_category():
    return [category.value for category in Category]