# Đây là file chứa các dependency dùng chung
from injector import Injector, Module, singleton
from app.core.config import Config

from app.db.ElasticSearch import ElasticSearch
from app.db.PosgreSQL import EngineSingleton, PosgreSQL


class Dependency(Module):

    def configure(self, binder):
        config = Config()
        elastic_search = ElasticSearch(config)
        posgresql = PosgreSQL(config)

        binder.bind(Config, to=config, scope=singleton)
        binder.bind(ElasticSearch, to=elastic_search)
        binder.bind(PosgreSQL, to=posgresql)
        binder.bind(EngineSingleton, to = EngineSingleton(config))

injector = Injector(Dependency)
