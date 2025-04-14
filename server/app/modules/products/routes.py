from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.modules.products.schemas import ProductOut
from app.modules.products.models import Product

router = APIRouter()

@router.get("/", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products
