from numpy import average
from sqlalchemy import event
from app.modules.products.models import ProductDocument, Product
from app.utils.logger import logger_setup

logger = logger_setup(__name__)


@event.listens_for(Product, "after_insert")
def sync_after_insert(mapper, connection, target: Product):
    """
    Mỗi khi Product mới được insert, tự động index vào Elasticsearch
    """
    doc = ProductDocument(
        meta={"id": str(target.id)},
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
        average_rating=target.average_rating,
        total_rating=target.total_rating,
        original=target.original,
        created_at=target.created_at,
        updated_at=target.updated_at,
    )
    doc.save()


@event.listens_for(Product, "after_update")
def sync_after_update(_, __, target: Product):
    """
    Mỗi khi Product được update, tự động cập nhật vào Elasticsearch
    """
    logger.info(f"[SYNC] Product updated: {target.id}")
    doc = ProductDocument.get(id=str(target.id))
    doc.update(
        product_name=target.product_name,
        price=target.price,
        description=target.description,
        image=target.image,
        category=target.category,
        brand=target.brand,
        size=target.size,
        color=target.color,
        stock=target.stock,
        average_rating=target.average_rating,
        total_rating=target.total_rating,
        original=target.original,
        updated_at=target.updated_at,
    )


@event.listens_for(Product, "after_delete")
def sync_after_delete(mapper, connection, target: Product):
    """
    Mỗi khi Product bị xóa, tự động xóa khỏi Elasticsearch
    """
    try:
        doc = ProductDocument.get(id=str(target.id))
        if doc:
            doc.delete()
    except Exception as e:
        # Ghi log nếu cần
        logger.error(f"Error deleting from Elasticsearch: {e}")
