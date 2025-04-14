from injector import inject
from app.db.base import BaseDB
from app.core.config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator, Type, Optional

class PosgreSQL(BaseDB):
    @inject
    def __init__(self, config: Config):
        super().__init__(config)
        self.engine = create_engine(self.config.DATABASE_URL)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_db(self) -> Generator[Session, None, None]:
       
        """ Provides a generator that yields a database session and ensures its proper closure.

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
        
        with self.get_db() as db:
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
        
        with self.get_db() as db:
            return db.query(model).filter(model.id == obj_id).first()

    def update(self, model: Type, obj_id: int, data: dict) -> Optional[object]:
        """
        Updates an existing record in the database.
        Args:
            model (Type): The SQLAlchemy model class representing the table.
            obj_id (int): The primary key of the record to update.
            data (dict): A dictionary containing the fields and their new values.
        Returns:
            Optional[object]: The updated object if found and updated successfully, 
                              otherwise None.
        """
        
        with self.get_db() as db:
            obj = db.query(model).filter(model.id == obj_id).first()
            if obj:
                for key, value in data.items():
                    setattr(obj, key, value)
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
        
        with self.get_db() as db:
            obj = db.query(model).filter(model.id == obj_id).first()
            if obj:
                db.delete(obj)
                db.commit()
            return obj