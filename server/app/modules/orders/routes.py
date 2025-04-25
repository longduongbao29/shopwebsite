from fastapi import APIRouter, HTTPException
from app.core.dependencies import injector
from app.modules.orders.OrderManager import OrderManager
from app.modules.orders.schemas import OrderProduct

router = APIRouter()
order_manager = injector.get(OrderManager)


@router.post("/orders/", response_model=dict)
def create_order(order: OrderProduct):
    try:
        order_manager.create_order(**order.model_dump())
        return {"detail": "Order created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))  # Unprocessable Entity
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/orders/{order_id}", response_model=OrderProduct)
def get_order(order_id: int):
    try:
        order = order_manager.get_order_by_id(order_id)
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return OrderProduct(**order).create_from_dict(order)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.put("/orders/{order_id}", response_model=dict)
def update_order_status(order_id: int, status: str):
    try:
        order = order_manager.update_order_status(order_id, status)
        if order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        return {"detail": "Order status updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))  # Unprocessable Entity
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/orders/{order_id}", response_model=dict)
def delete_order(order_id: int):
    try:
        success = order_manager.delete_order(order_id)
        if not success:
            raise HTTPException(status_code=404, detail="Order not found")
        return {"detail": "Order deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/orders/user/{user_id}", response_model=list)
def get_orders_by_user(user_id: int):
    try:
        orders = order_manager.get_orders_by_user_id(user_id)
        if not orders:
            raise HTTPException(status_code=404, detail="No orders found for this user")
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/orders/product/{product_id}", response_model=list[dict])
def get_orders_by_product(product_id: int):
    try:
        orders = order_manager.get_orders_by_product_id(product_id)
        if not orders:
            raise HTTPException(status_code=404, detail="No orders found for this product")
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/orders/status/{status}", response_model=list[dict])
def get_orders_by_status(status: str):
    try:
        orders = order_manager.get_orders_by_status(status)
        if not orders:
            raise HTTPException(status_code=404, detail="No orders found with this status")
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
