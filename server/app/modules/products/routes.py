from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Annotated, List, Optional

from jose import ExpiredSignatureError
from sympy import product

from app.db.Exceptions import RecordNotFoundException
from app.modules.products.schemas import (
    Product,
    ProductRating,
    ProductRatingResponse,
    ProductResponse,
    SearchProduct,
)
from app.modules.products.ProductManager import ProductManager
from app.modules.products.models import Category
from app.core.dependencies import injector
from app.modules.auth.Action import Action
from app.modules.auth.Authentication import Authentication, oauth2_scheme

from app.utils.logger import logger_setup

logger = logger_setup(__name__)


router = APIRouter()

product_manager = injector.get(ProductManager)


@router.get("/", response_model=list[ProductResponse], status_code=status.HTTP_200_OK)
async def list_products():
    try:
        products = product_manager.getAllProduct()
        return products
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get(
    "/get_by_id/{id}", response_model=ProductResponse, status_code=status.HTTP_200_OK
)
async def get_product(id: int):
    try:
        product = product_manager.getProductById(id)
        return product
    except RecordNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Record not found"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post(
    "/search",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
)
async def search_products_endpoint(search_product: SearchProduct):
    try:
        if search_product.min_price < 0 or search_product.max_price < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price must be greater than or equal to 0",
            )
        if search_product.min_price > search_product.max_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Min price must be less than max price",
            )
        if search_product.categories:
            for category in search_product.categories:
                if category not in [cat.value for cat in Category]:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid category: {category}",
                    )
        return product_manager.search_products(
            query=search_product.query,
            categories=search_product.categories,
            min_price=search_product.min_price,
            max_price=search_product.max_price,
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get("/categories", response_model=List[str], status_code=status.HTTP_200_OK)
async def get_categories():
    try:
        return [category.value for category in Category]
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching categories",
        )


@router.post("/add_product", response_model=dict, status_code=status.HTTP_200_OK)
async def add_product(product: Product, token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        Authentication.check_permission(token, Action.CREATE_PRODUCT)
        product_response = product_manager.createProduct(product)
        return {"message": f"Add 1 product, id {product_response.id}"}
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post(
    "/delete_product/{id}", response_model=dict, status_code=status.HTTP_200_OK
)
async def add_product(id: int, token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        Authentication.check_permission(token, Action.DELETE_PRODUCT)
        product_manager.deleteProduct(id)
        return {"message": f"Deleted product id = {id}"}
    except RecordNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Record not found"
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/rate_product/{id}", response_model=dict, status_code=status.HTTP_200_OK)
async def rate_product(
    token: Annotated[str, Depends(oauth2_scheme)],
    rating: ProductRating,
):
    try:
        user = Authentication.get_current_user(token)
        product_rating = dict(rating)
        product_rating["user_id"] = user["user_id"]
        product_manager.rateProduct(product_rating)
        return {
            "message": f"User {user['user_id']} rated product id = {product_rating['product_id']}"
        }

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get(
    "/get_rating/{product_id}",
    response_model=list[ProductRatingResponse],
    status_code=status.HTTP_200_OK,
)
async def get_rating(product_id: int):
    try:
        rating = product_manager.get_rating_by_product_id(product_id)
        return rating
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
