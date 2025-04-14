from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int
    name: str
    description: str = None
    price: int

    class Config:
        orm_mode = True
