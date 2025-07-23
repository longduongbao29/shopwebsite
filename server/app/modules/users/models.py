from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from app.core.dependencies import injector
from app.db.PosgreSQL import EngineSingleton

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    info = relationship(
        "UserInfo", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )

class UserInfo(Base):
    __tablename__ = "user_infos"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)
    user = relationship("User", back_populates="info")


Base.metadata.create_all(bind=injector.get(EngineSingleton)._engine)
