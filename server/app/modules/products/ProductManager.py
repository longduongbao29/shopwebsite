from injector import inject
from elasticsearch_dsl import Q
from elasticsearch_dsl import Search
from elasticsearch_dsl.query import ScriptScore
from typing import List, Optional, Type
from langchain_core.tools.base import BaseTool

from app.db.PosgreSQL import PosgreSQL
from app.modules.products.models import (
    ProductDocument,
    Category,
    Product as ProductModel,
)
from app.modules.products.schemas import Product, ProductResponse
from app.modules.chatbot.embedding.Embedding import Embedding
from app.db.ElasticSearch import ElasticSearch


class ProductManager:
    @inject
    def __init__(self, embedding: Embedding, es: ElasticSearch, pg: PosgreSQL):
        self.pg = pg
        self.es = es
        self.embedding = embedding

    def getAllProduct(self):
        es_results = ProductDocument.search().execute()
        products = []
        for doc in es_results:
            data = doc.to_dict()
            products.append(ProductResponse(**data))
        return products

    def createProduct(self, prd: Product):
        db_obj = self.pg.create(ProductModel, dict(prd))
        return ProductResponse(**db_obj.__dict__)

    def getProductSemantic(self, query):
        s = Search(index="products")
        query_vector = self.embedding.embedd(query)

        s = s.query(
            ScriptScore(
                query={"match_all": {}},
                script={
                    "source": "cosineSimilarity(params.query_vector, 'dense_vector') + 1.0",
                    "params": {"query_vector": query_vector},
                },
            )
        )

        results = s.execute()
        return [Product(**doc.to_dict()) for doc in results]

    @classmethod
    def search_products(
        cls,
        query: Optional[str] = None,
        categories: Optional[Category] = None,
        min_price: float = 0,
        max_price: float = 1e10,
    ) -> List[ProductResponse]:
        s = ProductDocument.search()

        # Price range filter
        s = s.filter("range", price={"gte": min_price, "lte": max_price})

        # Category filter (match any of the selected)
        if categories:
            s = s.filter("terms", category=categories)

        # Keyword match (search name/description/content)
        if query:
            keyword_query = Q(
                "multi_match",
                query=query,
                fields=["product_name", "description", "content"],
            )
            s = s.query(keyword_query)

        # Execute and format
        results = s.execute()
        products = []
        for doc in results:
            data = doc.to_dict()
            products.append(ProductResponse(**data))
        return products

    @classmethod
    def product_json(cls, produtcs: list[Product]):
        return [
            {
                "id": product.id,
                "product_name": product.product_name,
                "price": product.price,
                "description": product.description,
                "image": product.image,
                "category": product.category,
                "brand": product.brand,
                "size": product.size,
                "color": product.color,
                "stock": product.stock,
                "original": product.original,
                "created_at": product.created_at,
                "updated_at": product.updated_at,
            }
            for product in produtcs
        ]

    @classmethod
    def getSearchTool(cls):
        from pydantic import BaseModel, Field

        class ProductToolSchema(BaseModel):
            query: Optional[str] = Field(
                default=None, description="Query extracted from user input"
            )
            categories: Optional[List[str]] = Field(
                default=None,
                description='List of categories to filter products: "shirt", "tshirt", "jeans", "jacket", "dress", \
            "shoes", "accessory", "pants", "shorts", "hoodie", "bag".',
            )
            min_price: float = Field(
                default=0, description="Minimum price for the product search"
            )
            max_price: float = Field(
                default=1e10, description="Maximum price for the product search"
            )

        class ProductSearchTool(BaseTool):
            name: str = "product_search_tool"
            description: str = """Use this tool to search products from BuyMe Shop.
            Only use this tool if users ask about products from shop.
            """
            args_schema: Type[BaseModel] = ProductToolSchema
            return_direct: bool = True

            def _run(
                self,
                query: Optional[str] = None,
                categories: Optional[List[Category]] = None,
                min_price: float = 0,
                max_price: float = 1e10,
            ) -> str:
                products = ProductManager.search_products(
                    query, categories, min_price, max_price
                )

                return ProductManager.product_json(products)

        return ProductSearchTool()
