from abc import ABC, abstractmethod
from injector import inject
from sqlalchemy.ext.declarative import declarative_base
from app.core.config import Config

Base = declarative_base()

class BaseDB(ABC):
    @inject
    def __init__(self,config:Config):
        self.config = config
        
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
    