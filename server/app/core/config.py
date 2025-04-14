import os
from dotenv import load_dotenv

load_dotenv()  # Tải các biến từ .env

class Config:
    PROJECT_NAME: str = "E-Commerce API"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


