from sqlalchemy import event
from app.modules.products.models import ProductDocument, Product

@event.listens_for(Product, "after_insert")
def sync_after_insert(mapper, connection, target: Product):
    """
    Mỗi khi Product mới được insert, tự động index vào Elasticsearch
    """
    doc = ProductDocument(
        id=str(target.id),
        product_name=target.product_name,
        price=target.price,
        description=target.description,
        image=target.image,
        category=target.category,
        brand=target.brand,
        size=target.size,
        color=target.color,
        stock=target.stock,
        original=target.original,
        created_at=target.created_at,
        updated_at=target.updated_at,
    )
    doc.save()


@event.listens_for(Product, "after_update")
def sync_after_update(mapper, connection, target: Product):
    """
    Mỗi khi Product được update, tự động cập nhật vào Elasticsearch
    """
    ProductDocument.get(id=str(target.id)).update(
        doc={
            "product_name": target.product_name,
            "price": target.price,
            "description": target.description,
            "image": target.image,
            "category": target.category,
            "brand": target.brand,
            "size": target.size,
            "color": target.color,
            "stock": target.stock,
            "original": target.original,
            "updated_at": target.updated_at,
        }
    )
