import pytz
from injector import inject
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

from app.db.PosgreSQL import PosgreSQL
from app.modules.users.models import User
from app.modules.users.schemas import User as UserSchema
from app.utils.logger import logger_setup
from app.utils.helpers import model_to_dict

from app.core.config import Config
from app.modules.auth.Action import Action
from app.modules.auth.PermistionStrategy import (
    PermissionStrategy,
    AdminPermission,
    UserPermission,
)
from app.modules.auth.Exceptions import PermissionDeniedException

logger = logger_setup(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class PermissionRole:
    admin: PermissionStrategy = AdminPermission()
    user: PermissionStrategy = UserPermission()


class Authentication:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    config: Config = Config()

    @inject
    def __init__(self, sql_db: PosgreSQL):
        self.sql_db = sql_db

    @classmethod
    def get_current_user(cls, token: str):
        return jwt.decode(token, cls.config.SECRET_KEY, algorithms=cls.config.ALGORITHM)

    @classmethod
    def require_role(cls, token: str):
        user = cls.get_current_user(token)
        permissions: PermissionStrategy = getattr(PermissionRole, user["role"])
        return user, permissions

    @classmethod
    def check_permission(cls, token: str, action: Action):
        permission_denied_exception = PermissionDeniedException()

        user, permissions = cls.require_role(token)
        if not permissions.has_access(action):
            raise permission_denied_exception
        return user

    @classmethod
    def genToken(cls, payload: dict, expires_delta: timedelta = timedelta(minutes=15)):
        to_encode = payload.copy()
        expire = datetime.now(pytz.utc) + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, cls.config.SECRET_KEY, algorithm=cls.config.ALGORITHM
        )
        return encoded_jwt

    @classmethod
    def decodeToken(cls, token: str):
        return jwt.decode(
            token, cls.config.SECRET_KEY, algorithms=[cls.config.ALGORITHM]
        )

    @classmethod
    def hash_password(cls, password: str):
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, password: str, hashed_password: str):
        return cls.pwd_context.verify(password, hashed_password)

    def register(self, user: UserSchema):
        try:
            hashed_password = Authentication.hash_password(user.password)

            new_user = {
                "email": user.email,
                "role": "user",
                "hashed_password": hashed_password,
            }
            self.sql_db.create(User, new_user)

            logger.info(f"User with email {user.email} registered successfully.")
        except Exception as e:
            logger.info(f"Regist failed due to error: {e}")
            raise e
        return {"message": "Regist successfully"}

    def login(self, user: UserSchema):
        try:
            # Step 1: Get user from DB by email
            db_user = self.sql_db.get_by_field(User, "email", user.email).first()

            if not db_user:
                logger.info(f"Login failed: User with email {user.email} not found.")
                return {"error": "Invalid email or password"}, False

            # Step 2: Verify password
            if not Authentication.verify_password(
                user.password, db_user.hashed_password
            ):
                logger.info(f"Login failed: Incorrect password for email {user.email}.")
                return {"error": "Invalid email or password"}, False
            token = Authentication.genToken(model_to_dict(db_user))
            logger.info(f"User {user.email} logged in successfully.")
            return {"access_token": token, "token_type": "bearer"}, True

        except Exception as e:
            logger.error(f"Login failed due to error: {e}")
            return {"error": "Login failed due to server error"}, False
