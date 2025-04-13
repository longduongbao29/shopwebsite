from fastapi import APIRouter, HTTPException, status
from app.core.dependencies import injector
from app.modules.chatbot.schemas import ChatRequest, ChatResponse
from app.modules.chatbot.pipeline.chatbot import Chatbot
router = APIRouter()


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat(chat_request: ChatRequest):
    try:
        chatbot = injector.get(Chatbot)
        message, metadata = chatbot.run(chat_request)
        return ChatResponse(message=message, metadata=metadata)
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Server Error {e}")
@router.get("/random_chat", response_model = ChatResponse, status_code=status.HTTP_200_OK)
async def get_random_chat():
    try:
        chatbot = injector.get(Chatbot)
        message, metadata = chatbot.gen_random_chat()
        return ChatResponse(message=message, metadata=metadata)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error {e}")
