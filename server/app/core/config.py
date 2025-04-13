import os

class Config:
    PROJECT_NAME: str = "E-Commerce API"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("POSTGRES_URL", "sqlite:///./test.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # ElasticSearch
    ELASTIC_ENDPOINT: str = os.getenv("ELASTIC_ENDPOINT")
    ELASTIC_API_KEY: str = os.getenv("ELASTIC_API_KEY")
    ES_INDEX_NAME: str = os.getenv("ES_INDEX_NAME")
    EMBEDDING_MODEL: str = os.getenv(
        "EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2"
    )
    ELASTIC_CERT_PATH: str = os.getenv("ELASTIC_CERT_PATH")

    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY")
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", 0.7))

    # Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY")
