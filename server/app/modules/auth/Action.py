from enum import Enum

class Action(Enum):
    
    CREATE_USER = "create_user"
    DELETE_USER = "delete_user"
    UPDATE_USER_PROFILE = "update_user_profile"
    
    CREATE_PRODUCT = "create_product"
    DELETE_PRODUCT = "delete_product"
    UPDATE_PRODUCT = "update_product"
    GET_PRODUCT = "get_product"