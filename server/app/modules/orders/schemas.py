from pydantic import BaseModel

class OrderOut(BaseModel):
    id: int
    user_id: int
    status: str

    class Config:
        orm_mode = True
