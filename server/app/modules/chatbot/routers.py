from fastapi import APIRouter
from app.core.dependencies import injector
from app.modules.chatbot.schemas import ChatResponse
from app.modules.chatbot.pipeline.chatbot import Chatbot
router = APIRouter()


@router.get("/chat", response_model=ChatResponse)
def chat(user_input:str):
    chatbot = injector.get(Chatbot)
    message, metadata = chatbot.run(user_input)
    return ChatResponse(message=message, metadata=metadata)