from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Annotated, List, Optional

from jose import ExpiredSignatureError

from app.modules.products.schemas import Product
from app.modules.products.ProductManager import ProductManager
from app.modules.products.models import Category
from app.core.dependencies import injector
from app.modules.auth.Action import Action
from app.modules.auth.Authentication import Authentication, oauth2_scheme

from app.utils.logger import logger_setup

logger = logger_setup(__name__)


router = APIRouter()

product_manager = injector.get(ProductManager)


@router.get("/", response_model=list[Product], status_code=status.HTTP_200_OK)
async def list_products():
    
    products = product_manager.getAllProduct()
    return products

@router.get("/search", response_model=List[Product],status_code=status.HTTP_200_OK)
async def search_products_endpoint(
    query: Optional[str] = None,
    categories: Optional[List[str]] = Query(default=None),
    min_price: float = 0,
    max_price: float = 1e10,
):
    return product_manager.search_products(
        query=query, categories=categories, min_price=min_price, max_price=max_price
    )

@router.get("/category", response_model=List[str],status_code=status.HTTP_200_OK)
async def get_category():
    return [category.value for category in Category]

@router.post("/add_product", response_model=dict,status_code=status.HTTP_200_OK)
async def add_product(product: Product, token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        Authentication.check_permission(Action.CREATE_PRODUCT)
        
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)