from elasticsearch_dsl import Document, Text, Keyword, Float, Integer, Date
from enum import Enum
from datetime import datetime
from numpy import average
import pytz
from sqlalchemy.ext.declarative import declarative_base

from app.db.PosgreSQL import EngineSingleton
from app.core.dependencies import injector


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
    average_rating = Float()
    total_rating = Integer()
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
            average_rating=product.average_rating,
            total_rating=product.total_rating,
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
from sqlalchemy import Column, Integer, String, Float, DateTime, ARRAY

Base = declarative_base()


class Product(Base):
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
    average_rating = Column(Float, nullable=True, default=0.0)
    total_rating = Column(Integer, nullable=True, default=0)
    original = Column(String, nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(pytz.timezone("Asia/Ho_Chi_Minh"))
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(pytz.timezone("Asia/Ho_Chi_Minh")),
        onupdate=lambda: datetime.now(pytz.timezone("Asia/Ho_Chi_Minh")),
    )


class Ratings(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    product_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(String, nullable=True)
    created_at = Column(
        DateTime, default=lambda: datetime.now(pytz.timezone("Asia/Ho_Chi_Minh"))
    )


Base.metadata.create_all(bind=injector.get(EngineSingleton)._engine)
