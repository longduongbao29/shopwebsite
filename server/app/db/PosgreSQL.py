from injector import inject
from typing import Generator, Type, Optional, Any
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import sessionmaker, Session
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

        logger.info(config.DATABASE_URL)


class PosgreSQL(BaseDB):

    @inject
    def __init__(self, config: Config):
        self.config = config

        self.engine = EngineSingleton(config)._engine
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )

    def get_db(self) -> Generator[Session, None, None]:
        """Provides a generator that yields a database session and ensures its proper closure.

        This method is typically used to manage the lifecycle of a database session
        in a context where dependency injection is required, such as in web frameworks
        like FastAPI. It creates a new session from the `SessionLocal` factory, yields
        it for use, and ensures the session is closed after use to release resources.

        Yields:
            Session: A SQLAlchemy database session object.

        Example:
            ```python

            def some_function():
                db = next(get_db())
                # Use the db session here
            ```
        """
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def create(self, model: Type, data: dict) -> object:
        """
        Creates and persists a new record in the database.
        Args:
            model (Type): The SQLAlchemy model class representing the database table.
            data (dict): A dictionary containing the data to initialize the model instance.
        Returns:
            object: The newly created and persisted model instance.
        Raises:
            SQLAlchemyError: If there is an issue with the database operation.
        """

        db = next(self.get_db())
        obj = model(**data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def read(self, model: Type, obj_id: int) -> Optional[object]:
        """
        Retrieve a single record from the database based on the provided model and object ID.
        Args:
            model (Type): The SQLAlchemy model class representing the database table.
            obj_id (int): The ID of the object to retrieve.
        Returns:
            Optional[object]: An instance of the model if found, otherwise None.
        """

        db = next(self.get_db())
        return db.query(model).filter(model.id == obj_id).first()

    def update(self, model: Type, key: str, value: Any, data: dict) -> Optional[object]:
        """
        Updates an existing record in the database.
        Args:
            model (Type): The SQLAlchemy model class representing the table.
            key (str): The field name to look up the record.
            value (Any): The value to match in the key field.
            data (dict): A dictionary containing the fields and their new values.
        Returns:
            Optional[object]: The updated object if found and updated successfully,
                            otherwise None.
        """

        db = next(self.get_db())
        if not hasattr(model, key):
            raise AttributeError(f"Model '{model.__name__}' does not have field '{key}'.")

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
        """
        Deletes an object from the database based on its model and ID.
        Args:
            model (Type): The SQLAlchemy model class of the object to be deleted.
            obj_id (int): The ID of the object to be deleted.
        Returns:
            Optional[object]: The deleted object if it existed, otherwise None.
        """

        pass

    def delete_by_field(self, model: Type, field_name: str, value) -> Optional[object]:
        """
        Deletes an object from the database based on a specific field and value.

        Args:
            model (Type): The SQLAlchemy model class of the object.
            field_name (str): The name of the field to filter by.
            value (Any): The value to match against the field.

        Returns:
            Optional[object]: The deleted object if it existed, otherwise None.
        """
        db = next(self.get_db())

        if not hasattr(model, field_name):
            raise AttributeError(
                f"Field '{field_name}' does not exist in model '{model.__name__}'"
            )

        field = getattr(model, field_name)
        objs = db.query(model).filter(field == value).all()
        print(objs)
        for obj in objs:
            db.delete(obj)
            db.commit()
        return objs

    def get_all(
        self, model: Type, limit: Optional[int] = None, offset: Optional[int] = None
    ) -> list:
        """
        Retrieve all records from the database for a given model.
        Args:
            model (Type): The SQLAlchemy model class representing the table.
            limit (Optional[int]): The number of records to retrieve (pagination).
            offset (Optional[int]): The starting point to retrieve records (pagination).
        Returns:
            list: A list of model instances.
        """
        db = next(self.get_db())
        query = db.query(model)
        if limit:
            query = query.limit(limit)
        if offset:
            query = query.offset(offset)
        return query.all()

    def filter(self, model: Type, **filters) -> list:
        """
        Retrieve records from the database based on specific filters.
        Args:
            model (Type): The SQLAlchemy model class representing the table.
            **filters: Key-value pairs for the filter criteria.
        Returns:
            list: A list of model instances that match the filters.
        """
        db = next(self.get_db())
        query = db.query(model)
        for key, value in filters.items():
            query = query.filter(getattr(model, key) == value)
        return query.all()

    def count(self, model: Type) -> int:
        """
        Count the number of records in a table for a given model.
        Args:
            model (Type): The SQLAlchemy model class representing the table.
        Returns:
            int: The count of records.
        """
        db = next(self.get_db())
        return db.query(model).count()

    def get_by_field(self, model: Type, field: str, value):
        """
        Retrieve a single record from the database based on a dynamic field.

        Args:
            model (Type): SQLAlchemy model class.
            field (str): Field name to query by.
            value (Any): Value to match.

        Returns:
            Optional[object]: The matched record if found, otherwise None.

        Raises:
            ValueError: If field name is not a string or model doesn't have the field.
        """
        if not isinstance(field, str):
            raise ValueError("Field name must be a string.")

        if not hasattr(model, field):
            raise AttributeError(f"'{model.__name__}' has no attribute '{field}'.")

        try:
            db: Session = next(self.get_db())
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

    def bulk_create(self, model: Type, data_list: list) -> list:
        """
        Insert multiple records into the database.
        Args:
            model (Type): The SQLAlchemy model class representing the table.
            data_list (list): A list of dictionaries containing data for each record.
        Returns:
            list: A list of the newly created model instances.
        """
        db = next(self.get_db())
        objects = [model(**data) for data in data_list]
        db.add_all(objects)
        db.commit()
        db.refresh(objects)
        return objects
