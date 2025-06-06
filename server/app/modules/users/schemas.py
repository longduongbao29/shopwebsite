from pydantic import BaseModel, Field


class User(BaseModel):
    email: str
    password: str


class UserInfo(BaseModel):
    first_name: str
    last_name: str
    address: str | None = None
    phone_number: str | None = None

    class Config:
        from_attributes = True

