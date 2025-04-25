from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sympy import product

Base = declarative_base()
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    
    products_id = Column(String, nullable=False)
    
    customer_id = Column(Integer, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_province = Column(String, nullable=False)
    customer_district = Column(String, nullable=False)
    customer_ward = Column(String, nullable=False)
    customer_address = Column(String, nullable=False)
    
    status = Column(String, default="pending")
