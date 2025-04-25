from typing import Optional
from injector import inject
from app.db.PosgreSQL import PosgreSQL
from app.modules.orders.models import Order
from app.utils.logger import logger_setup

logger = logger_setup(__name__)


class OrderManager:
    @inject
    def __init__(self, db:PosgreSQL):
        self.db = db
    def create_order(self, order_data: dict) -> Order:
        try:
            new_order = self.db.create(Order, order_data)
            return new_order
        except Exception as e:
            logger.exception(f"Failed to create order: {e}")
            raise e
    def get_order_by_id(self, order_id: int) -> Optional[Order]:
        try:
            order = self.db.read(Order, order_id)
            if not order:
                logger.warning(f"Order with ID {order_id} not found")
                return None
            return order
        except Exception as e:
            logger.exception(f"Failed to retrieve order: {e}")
            raise e
    def update_order_status(self, order_id: int, status: str) -> Optional[Order]:
        try:
            with self.db.db_context() as db:
                order = db.query(Order).filter(Order.id == order_id).first()
                if not order:
                    logger.warning(f"Order with ID {order_id} not found")
                    return None
                order.status = status
                db.commit()
                db.refresh(order)
                return order
        except Exception as e:
            logger.exception(f"Failed to update order status: {e}")
            raise e
    def delete_order(self, order_id: int) -> bool:
        try:
            with self.db.db_context() as db:
                order = db.query(Order).filter(Order.id == order_id).first()
                if not order:
                    logger.warning(f"Order with ID {order_id} not found")
                    return False
                db.delete(order)
                db.commit()
                return True
        except Exception as e:
            logger.exception(f"Failed to delete order: {e}")
            raise e
    def get_orders_by_user_id(self, user_id: int) -> list[Order]:
        try:
            with self.db.db_context() as db:
                orders = db.query(Order).filter(Order.user_id == user_id).all()
                return orders
        except Exception as e:
            logger.exception(f"Failed to retrieve orders for user {user_id}: {e}")
            raise e
    def get_orders_by_product_id(self, product_id: int) -> list[Order]:
        try:
            with self.db.db_context() as db:
                orders = db.query(Order).filter(Order.products_id.contains(str(product_id))).all()
                return orders
        except Exception as e:
            logger.exception(f"Failed to retrieve orders for product {product_id}: {e}")
            raise e
    def get_orders_by_status(self, status: str) -> list[Order]:
        try:
            with self.db.db_context() as db:
                orders = db.query(Order).filter(Order.status == status).all()
                return orders
        except Exception as e:
            logger.exception(f"Failed to retrieve orders with status {status}: {e}")
            raise e
  