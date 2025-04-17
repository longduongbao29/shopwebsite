from uuid import uuid4
from elasticsearch_dsl import Document, Text, Keyword, Float, Integer, Date
from enum import Enum
from datetime import datetime
import pytz


class Category(str, Enum):
    SHIRT = "shirt"
    TSHIRT = "tshirt"
    JEANS = "jeans"
    JACKET = "jacket"
    DRESS = "dress"
    SHOES = "shoes"
    ACCESSORY = "accessory"
    PANTS = "pants"
    SHORTS = "shorts"
    HOODIE = "hoodie"
    BAG = "bag"


class Size(str, Enum):
    S = "S"
    SM = "SM"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"
    XXXL = "XXXL"


# Elasticsearch DSL document
class ProductDocument(Document):
    id = Integer()
    product_name = Text()
    price = Float()
    description = Text()
    image = Text()
    category = Keyword(multi=True)
    brand = Keyword()
    size = Keyword(multi=True)
    color = Keyword(multi=True)
    stock = Integer()
    original = Keyword()
    created_at = Date()
    updated_at = Date()

    class Index:
        name = "buymeshop_products"

    @classmethod
    def from_product(cls, product: "Product"):
        """
        Khởi tạo ProductDocument từ instance SQLAlchemy Product.
        """
        doc = cls(
            product_name=product.product_name,
            price=product.price,
            description=product.description,
            image=product.image,
            category=product.category,
            brand=product.brand,
            size=product.size,
            color=product.color,
            stock=product.stock,
            original=product.original,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )
        return doc

    def save(self, **kwargs):
        utc_time = datetime.now(pytz.utc)
        if not self.created_at:
            self.created_at = utc_time.astimezone(pytz.timezone("Asia/Ho_Chi_Minh"))
        self.updated_at = utc_time.astimezone(pytz.timezone("Asia/Ho_Chi_Minh"))
        return super().save(**kwargs)


from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ARRAY
from app.db.PosgreSQL import PosgreSQL


class Product(PosgreSQL.Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    product_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    category = Column(ARRAY(String), nullable=False, default=list)
    brand = Column(String, nullable=True)
    size = Column(ARRAY(String), nullable=True, default=list)
    color = Column(ARRAY(String), nullable=True, default=list)
    stock = Column(Integer, nullable=False, default=0)
    original = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
