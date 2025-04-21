from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    input: str
    chat_history: str | None = Field(default=None, description="Context for the query")


class ChatResponse(BaseModel):
    message: str
    metadata: dict | None