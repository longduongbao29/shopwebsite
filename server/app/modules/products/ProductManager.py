from elasticsearch_dsl import Q
from typing import List, Optional, Type
from langchain_core.tools.base import BaseTool

from app.core.dependencies import injector
from app.db.Exceptions import RecordNotFoundException
from app.db.PosgreSQL import PosgreSQL
from app.modules.products.models import (
    ProductDocument,
    Category,
    Product as ProductModel,
    Ratings,
)
from app.modules.products.schemas import (
    Product,
    ProductRating,
    ProductRatingResponse,
    ProductResponse,
)
from app.utils.logger import logger_setup
from app.modules.users.models import User, UserInfo

logger = logger_setup(__name__)


class ProductManager:
    pg = injector.get(PosgreSQL)

    @classmethod
    def getAllProduct(cls):
        try:
            es_results = ProductDocument.search().execute()
            products = [ProductResponse(**doc.to_dict()) for doc in es_results]
            return products
        except Exception as e:
            products = []
            logger.exception("Failed to fetch all products")
        return products

    @classmethod
    def createProduct(cls, prd: Product):
        try:
            db_obj = cls.pg.create(ProductModel, dict(prd))
            return ProductResponse(**db_obj.__dict__)
        except Exception as e:
            logger.error(f"Create product failed: {e}")
            raise e

    @classmethod
    def deleteProduct(cls, id: int):
        try:
            products = cls.pg.delete_by_field(ProductModel, "id", id)
            if not products:
                raise RecordNotFoundException(f"Product with ID {id} not found.")
        except Exception as e:
            logger.error(f"Delete product failed: {e}")
            raise e

    @classmethod
    def getProductById(cls, id: int):
        try:
            product = cls.pg.get_by_field(ProductModel, "id", id).first()
            if not product:
                raise RecordNotFoundException(f"Product with ID {id} not found.")
            return ProductResponse(**product.__dict__)
        except Exception as e:
            logger.error(f"Get product by ID failed: {e}")
            raise e

    @classmethod
    def search_products(
        cls,
        query: Optional[str] = None,
        categories: Optional[List[Category]] = None,
        min_price: float = 0,
        max_price: float = 1e10,
    ) -> List[ProductResponse]:
        try:
            s = ProductDocument.search()

            # Price range
            s = s.filter("range", price={"gte": min_price, "lte": max_price})

            # Categories
            if categories:
                s = s.filter("terms", category=[str(cat) for cat in categories])

            # Query
            if query:
                s = s.query(
                    Q(
                        "multi_match",
                        query=query,
                        fields=["product_name", "description", "content"],
                    )
                )

            results = s.execute()
            return [ProductResponse(**doc.to_dict()) for doc in results]
        except Exception as e:
            logger.error(f"Search products failed: {e}")
            raise e

    @classmethod
    def product_json(cls, products: List[ProductResponse]):
        return [
            {
                "id": p.id,
                "product_name": p.product_name,
                "price": p.price,
                "description": p.description,
                "image": p.image,
                "category": p.category,
                "brand": p.brand,
                "size": p.size,
                "color": p.color,
                "stock": p.stock,
                "original": p.original,
                "created_at": p.created_at,
                "updated_at": p.updated_at,
            }
            for p in products
        ]

    @classmethod
    def getSearchTool(cls):
        from pydantic import BaseModel, Field

        class ProductToolSchema(BaseModel):
            query: Optional[str] = Field(default=None, description="User search query")
            categories: Optional[List[str]] = Field(
                default=None,
                description='List of categories: "shirt", "tshirt", "jeans", "jacket", "dress", "shoes", "accessory", "pants", "shorts", "hoodie", "bag".',
            )
            min_price: float = Field(default=0, description="Minimum price")
            max_price: float = Field(default=1e10, description="Maximum price")

        class ProductSearchTool(BaseTool):
            name: str = "product_search_tool"
            description: str = (
                "Search products from BuyMe Shop. Only use if user mentions products."
            )
            args_schema: Type[BaseModel] = ProductToolSchema
            return_direct: bool = True

            def _run(
                self,
                query: Optional[str] = None,
                categories: Optional[List[str]] = None,
                min_price: float = 0,
                max_price: float = 1e10,
            ) -> str:
                category_enum = (
                    [Category(cat) for cat in categories] if categories else None
                )
                products = ProductManager.search_products(
                    query, category_enum, min_price, max_price
                )
                return ProductManager.product_json(products)

        return ProductSearchTool()

    @classmethod
    def rateProduct(cls, product_rating: dict):
        try:
            # Create a new rating entry
            db_obj = cls.pg.create(Ratings, product_rating)

            # Update the average rating and total rating in the Product table
            cls.update_average_rating(product_rating["product_id"])

            return {"message": "Rating successful", "data": db_obj.__dict__}
        except Exception as e:
            logger.error(f"Rate product failed: {e}")
            raise e

    @classmethod
    def update_average_rating(cls, product_id: int):
        try:
            # Fetch all ratings for the product
            ratings = cls.pg.get_by_field(Ratings, "product_id", product_id).all()
            if not ratings:
                raise RecordNotFoundException(
                    f"No ratings found for product ID {product_id}."
                )

            # Calculate the average rating and total rating
            total_rating = len(ratings)
            average_rating = sum(r.rating for r in ratings) / len(ratings)

            # Update the Product model with the new ratings
            cls.pg.update_by_field(
                ProductModel,
                "id",
                product_id,
                {"average_rating": average_rating, "total_rating": total_rating},
            )
        except Exception as e:
            logger.error(f"Update average rating failed: {e}")
            raise e

    @classmethod
    def get_rating_by_product_id(cls, product_id: int):
        try:
            # 1. Truy vấn tất cả rating và preload luôn user info (JOIN 1 lần)
            from sqlalchemy.sql import func

            db = cls.pg.get_session()
            results = (
                db.query(
                    Ratings,
                    func.concat(UserInfo.first_name, " ", UserInfo.last_name).label(
                        "user_name"
                    ),
                )
                .outerjoin(UserInfo, Ratings.user_id == UserInfo.user_id)
                .filter(Ratings.product_id == product_id)
                .all()
            )
            # 2. Format kết quả trả về
            ratings_with_user = []
            for rating, user_name in results:
                rating_dict = rating.__dict__.copy()
                rating_dict["user_name"] = user_name
                ratings_with_user.append(ProductRatingResponse(**rating_dict))

            return ratings_with_user

        except Exception as e:
            logger.error(f"Failed to fetch ratings with user info: {e}")
            raise e
