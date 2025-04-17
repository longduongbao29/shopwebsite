# Đây là file chứa các dependency dùng chung
from injector import Injector, Module, singleton
from sqlalchemy import create_engine
from app.core.config import Config

from app.db.ElasticSearch import ElasticSearch
from app.modules.chatbot.embedding.Embedding import Embedding
from app.modules.products.ProductManager import ProductManager
from app.db.PosgreSQL import PosgreSQL


class Dependency(Module):
    

    def configure(self, binder):
        config = Config()
        elastic_search = ElasticSearch(config)
        posgresql = PosgreSQL(config)
        embedding = Embedding(config)
    
        binder.bind(Config, to=config, scope=singleton)
        binder.bind(Embedding, to=embedding)
        binder.bind(ElasticSearch, to=elastic_search)
        binder.bind(
            ProductManager,
            to=ProductManager(embedding=embedding, es=elastic_search),
        )
        binder.bind(PosgreSQL, to=posgresql)


injector = Injector(Dependency)
