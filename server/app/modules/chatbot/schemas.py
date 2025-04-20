from pydantic import BaseModel

class ChatResponse(BaseModel):
    message: str
    metadata: dict | None