from fastapi import FastAPI
from app.modules.auth.routes import router as auth_router
from app.modules.users.routes import router as users_router
from app.modules.products.routes import router as products_router
# from app.modules.orders.routes import router as orders_router
from app.modules.chatbot.routers import router as chatbot_router
import app.db.sync

app = FastAPI(
    title="E-Commerce API",
    description="Hệ thống bán hàng e-commerce bán quần áo theo kiến trúc Modular Monolith",
    version="1.0.0"
)

# Include các router của từng module
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(products_router, prefix="/api/products", tags=["Products"])
# app.include_router(orders_router, prefix="/api/orders", tags=["Orders"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Chatbot"])
@app.get("/")
def read_root():
    return {"message": "Welcome to E-Commerce API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=1234, reload=True)
