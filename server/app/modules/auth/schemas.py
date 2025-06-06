from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
