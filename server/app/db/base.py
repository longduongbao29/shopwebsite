from abc import ABC, abstractmethod
from injector import inject
from sqlalchemy import Engine
from sqlalchemy.ext.declarative import declarative_base
from app.core.config import Config

Base = declarative_base()


class BaseDB(ABC):
    config: Config

    @abstractmethod
    def create(self):
        pass

    @abstractmethod
    def read(self):
        pass

    @abstractmethod
    def delete(self):
        pass

    @abstractmethod
    def update(self):
        pass
