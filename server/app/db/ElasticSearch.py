from injector import inject
from elasticsearch import Elasticsearch
from elasticsearch_dsl import connections

from app.core.config import Config
from app.db.base import BaseDB
from app.modules.chatbot.embedding.Embedding import Embedding
from app.utils.logger import logger_setup

logger = logger_setup(__name__)


class ElasticSearch(BaseDB):

    @inject
    def __init__(self, config: Config):
        super().__init__(config)
        self.client: Elasticsearch
        self.dsl_connnections:Elasticsearch
        self.index_name = self.config.ES_INDEX_NAME
        self.connect()
    def connect(self):
        try:
            self.client = Elasticsearch(
                self.config.ELASTIC_ENDPOINT, api_key=self.config.ELASTIC_API_KEY, ca_certs=self.config.ELASTIC_CERT_PATH
            )
            self.dsl_connnections = connections.add_connection("default", self.client)
            logger.info("Connect to ElasticSearch successfully!!!")
        except Exception as e:
            logger.info(f"Connect to ElasticSearch failed! {e}")
            raise e
    def getClient(self):
        return self.client
    def create(self, document):
        self.client.index(index=self.index_name, id=document["id"], document=document)
        logger.info(f"Document with ID {document.id} indexed successfully!")

    def read(self):
        hits = self.client.search(index=self.index_name, query={"match_all": {}})
        return hits
    def update(self):
        return super().update()

    def delete(self):
        return super().delete()
