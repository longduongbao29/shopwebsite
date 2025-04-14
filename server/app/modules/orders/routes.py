from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.orders.schemas import OrderOut
from app.modules.orders.models import Order

router = APIRouter()

@router.get("/", response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders
