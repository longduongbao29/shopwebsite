from injector import inject
from typing import Generator, Type, Optional, Any, List
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager

from app.db.base import BaseDB
from app.core.config import Config
from app.utils.logger import logger_setup

logger = logger_setup(__name__)


class EngineSingleton:
    _engine = None

    @inject
    def __init__(self, config: Config):
        if not EngineSingleton._engine:
            EngineSingleton._engine = create_engine(config.DATABASE_URL)


class PosgreSQL(BaseDB):

    @inject
    def __init__(self, config: Config):
        self.config = config
        self.engine = EngineSingleton(config)._engine
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )

    @contextmanager
    def db_context(self) -> Generator[Session, None, None]:
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    def get_session(self) -> Session:
        return self.SessionLocal()
    
    def create(self, model: Type, data: dict) -> object:
        with self.db_context() as db:
            obj = model(**data)
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return obj

    def read(self, model: Type, obj_id: int) -> Optional[object]:
        with self.db_context() as db:
            return db.query(model).get(obj_id)

    def update(self, model: Type, key: str, value: Any, data: dict) -> Optional[object]:
        with self.db_context() as db:
            if not hasattr(model, key):
                raise AttributeError(
                    f"Model '{model.__name__}' does not have field '{key}'."
                )

            field = getattr(model, key)
            obj = db.query(model).filter(field == value).first()

            if obj:
                for attr, new_val in data.items():
                    if hasattr(obj, attr):
                        setattr(obj, attr, new_val)
                db.commit()
                db.refresh(obj)

            return obj

    def delete(self, model: Type, obj_id: int) -> Optional[object]:
        with self.db_context() as db:
            obj = db.query(model).get(obj_id)
            if obj:
                db.delete(obj)
                db.commit()
            return obj

    def delete_by_field(
        self, model: Type, field_name: str, value
    ) -> Optional[List[object]]:
        with self.db_context() as db:
            if not hasattr(model, field_name):
                raise AttributeError(
                    f"Field '{field_name}' does not exist in model '{model.__name__}'"
                )

            field = getattr(model, field_name)
            objs = db.query(model).filter(field == value).all()
            for obj in objs:
                db.delete(obj)
            db.commit()
            return objs

    def get_all(
        self, model: Type, limit: Optional[int] = None, offset: Optional[int] = None
    ) -> List[object]:
        with self.db_context() as db:
            query = db.query(model)
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)
            return query.all()

    def filter(self, model: Type, **filters) -> List[object]:
        with self.db_context() as db:
            query = db.query(model)
            for key, value in filters.items():
                query = query.filter(getattr(model, key) == value)
            return query.all()

    def count(self, model: Type) -> int:
        with self.db_context() as db:
            return db.query(model).count()

    def get_by_field(self, model: Type, field: str, value) -> Optional[object]:
        if not isinstance(field, str):
            raise ValueError("Field name must be a string.")
        if not hasattr(model, field):
            raise AttributeError(f"'{model.__name__}' has no attribute '{field}'.")

        try:
            with self.db_context() as db:
                column = getattr(model, field)
                return db.query(model).filter(column == value)
        except SQLAlchemyError as e:
            logger.error(
                f"Database error while querying {model.__name__}.{field} == {value}: {e}"
            )
            return None
        except Exception as e:
            logger.exception(f"Unexpected error during get_by_field: {e}")
            return None

    def get_by_field_in(self, model: Type, field: str, values: list) -> List[object]:
        if not isinstance(field, str):
            raise ValueError("Field name must be a string.")
        if not hasattr(model, field):
            raise AttributeError(f"'{model.__name__}' has no attribute '{field}'.")

        try:
            with self.db_context() as db:
                column = getattr(model, field)
                return db.query(model).filter(column.in_(values)).all()
        except SQLAlchemyError as e:
            logger.error(
                f"Database error while querying {model.__name__}.{field} in {values}: {e}"
            )
            return []
        except Exception as e:
            logger.exception(f"Unexpected error during get_by_field_in: {e}")
            return []

    def bulk_create(self, model: Type, data_list: list) -> list:
        with self.db_context() as db:
            objects = [model(**data) for data in data_list]
            db.add_all(objects)
            db.commit()
            for obj in objects:
                db.refresh(obj)
            return objects
    def update_by_field(
        self, model: Type, field_name: str, field_value: Any, update_data: dict
    ) -> Optional[object]:
        if not hasattr(model, field_name):
            raise AttributeError(
                f"Field '{field_name}' does not exist in model '{model.__name__}'"
            )

        with self.db_context() as db:
            field = getattr(model, field_name)
            obj = db.query(model).filter(field == field_value).first()

            if obj:
                for attr, new_val in update_data.items():
                    if hasattr(obj, attr):
                        setattr(obj, attr, new_val)
                db.commit()
                db.refresh(obj)

            return obj