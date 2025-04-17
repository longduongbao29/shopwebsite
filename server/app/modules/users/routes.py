from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from jose import ExpiredSignatureError

from app.modules.auth.Exceptions import PermissionDeniedException
from app.modules.users.UserManager import UserManager
from app.modules.users.schemas import UserInfo, User
from app.core.dependencies import injector
from app.modules.auth.Authentication import Authentication, oauth2_scheme
from app.modules.auth.Action import Action
from app.utils.logger import logger_setup

logger = logger_setup(__name__)

router = APIRouter()


@router.post("/update_profile", response_model=dict, status_code=status.HTTP_200_OK)
async def update_profile(
    user_info: UserInfo, token: Annotated[str, Depends(oauth2_scheme)]
):
    try:
        Authentication.check_permission(token, Action.UPDATE_USER_PROFILE)
        user = Authentication.get_current_user(token)
        user_manager = injector.get(UserManager)
        user_manager.update_user_info(user, dict(user_info))
        return {"message": f"Updated user's profile email{user['email']}"}
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/delete/{user_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: str,
    token: Annotated[User, Depends(oauth2_scheme)],
):
    try:
        Authentication.check_permission(token, Action.DELETE_USER)
        user_manager = injector.get(UserManager)
        user_manager.delete_by_id(user_id)
        return {"message": f"Deleted {user_id}"}
    except PermissionDeniedException as e:
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=e.message)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
