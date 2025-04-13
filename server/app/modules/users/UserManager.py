from injector import inject
from app.db.PosgreSQL import PosgreSQL
from ..auth.Exceptions import PermissionDeniedException
from app.modules.users.models import UserInfo, User
from app.modules.users.schemas import User as UserSchema
from app.utils.logger import logger_setup
from app.modules.auth.Authentication import Authentication

logger = logger_setup(__name__)


class UserManager:
    @inject
    def __init__(self, sql_db: PosgreSQL):
        self.sql_db = sql_db

    def create(self, user):
        try:
            self.sql_db.create(User, user)
            return True
        except Exception as e:
            logger.error(f"Create new user failed due to error: {e}")
            return False

    def get_by_id(self, user_id: str):
        try:
            return self.sql_db.get_by_field(User, "user_id", user_id)
        except Exception as e:
            logger.error(f"Get user by ID failed due to error: {e}")
            return None

    def get_by_email(self, email: str):
        try:
            return self.sql_db.get_by_field(User, "email", email)
        except Exception as e:
            logger.error(f"Get user by email failed due to error: {e}")
            return None

    def delete_by_id(self, user_id: str):
        try:
            user = self.get_by_id(user_id).__dict__

            if user["role"] == "admin":
                print(user["role"])
                raise PermissionDeniedException("Cannot delete admin accounts!!!")
            self.sql_db.delete_by_field(User, "user_id", user_id)
        except Exception as e:
            logger.error(f"Delete user by ID failed due to error: {e}")
            raise e

    def delete_by_email(self, email: str):
        try:
            user = self.get_by_email(email).__dict__
            if user["role"] == "admin":
                raise PermissionDeniedException("Cannot delete admin accounts!!!")
            self.sql_db.delete_by_field(User, "email", email)
        except Exception as e:
            logger.error(f"Delete user by email failed due to error: {e}")
            raise e

    def update_user_info(self, user, user_info: dict):
        user_info["user_id"] = user["user_id"]
        user_info["email"] = user["email"]
        profile = self.sql_db.get_by_field(UserInfo, "user_id", user["user_id"]).first()
        if not profile:
            self.sql_db.create(UserInfo, user_info)
        else:
            self.sql_db.update(UserInfo, "user_id", user["user_id"], user_info)
