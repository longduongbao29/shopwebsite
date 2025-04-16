from uuid import uuid4
from elasticsearch_dsl import Document, Text, Keyword, Float, Integer, Date, DenseVector
from enum import Enum
from datetime import datetime
from app.modules.chatbot.embedding.Embedding import Embedding
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
    id = Keyword()
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
    content = Text()
    dense_vector = DenseVector(dims=768)
    class Index:
        name = "buymeshop_products"
    def save(self,embedding:Embedding ,**kwargs):
        utc_time = datetime.now(pytz.utc)
        self.id = str(uuid4())
        # Nếu chưa có embedding, tự generate từ description
        if not self.dense_vector and self.description:
            embedding_text = f"ID: {self.id}\n"
            embedding_text += f"Name: {self.product_name}\n"
            embedding_text += f"Category: {self.category}\n"
            embedding_text += f"Brand: {self.brand}\n"
            embedding_text += f"Size: {self.size}\n"
            embedding_text += f"Color: {self.color}\n"
            embedding_text += f"Stock: {self.stock}\n"
            embedding_text += f"Price: {self.price}\n"
            embedding_text += f"Original: {self.original}\n"
            embedding_text += f"Description: {self.description}\n"
            self.content = embedding_text

            embedding_result = embedding.embedd(embedding_text)
            self.dense_vector = embedding_result
        if not self.created_at:
            self.created_at = utc_time.astimezone(pytz.timezone("Asia/Ho_Chi_Minh"))
        self.updated_at = utc_time.astimezone(pytz.timezone("Asia/Ho_Chi_Minh"))
        return super().save(**kwargs)
