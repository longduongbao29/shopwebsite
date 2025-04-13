from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from app.core.config import Config

class Embedding:
    def __init__(self, config:Config):
        self.config = config
        self.model = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)
    def embedd(self,text:str)->list[float]:
        return self.model.embed_query(text)
