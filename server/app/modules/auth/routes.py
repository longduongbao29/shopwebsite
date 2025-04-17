from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.modules.auth.Authentication import Authentication
from app.modules.users.UserManager import UserManager
from app.modules.users.schemas import UserInfo, User
from app.core.dependencies import injector

router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_user(user: User):
    try:
        authen = injector.get(Authentication)
        return authen.register(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Register failed: {str(e)}"
        )


@router.post("/login", response_model=dict, status_code=status.HTTP_200_OK)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        authen = injector.get(Authentication)
        result, success = authen.login(
            User(email=form_data.username, password=form_data.password)
        )
        if success:
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result.get("error", "Login failed"),
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Login failed: {str(e)}"
        )
    