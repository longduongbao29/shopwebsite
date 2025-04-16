# Đây là file chứa các dependency dùng chung
from injector import Injector, Module, singleton
from app.core.config import Config

from app.db.ElasticSearch import ElasticSearch
from app.modules.chatbot.embedding.Embedding import Embedding
from app.modules.products.ProductManager import ProductManager


class Dependency(Module):
    def configure(self, binder):
        config = Config()
        elastic_search = ElasticSearch(config)
        embedding = Embedding(config)
        
        binder.bind(Config,to=config, scope=singleton)
        binder.bind(Embedding, to= embedding)
        binder.bind(ElasticSearch, to=elastic_search)
        binder.bind(ProductManager, to=ProductManager(embedding=embedding,
                                                      es=elastic_search))


injector = Injector(Dependency)
