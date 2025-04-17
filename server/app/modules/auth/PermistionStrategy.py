from app.modules.auth.Action import Action


class PermissionStrategy:
    def has_access(self, action: str) -> bool:
        raise NotImplementedError


class AdminPermission(PermissionStrategy):
    def has_access(self, action: Action) -> bool:
        return True


class UserPermission(PermissionStrategy):
    def __init__(self):
        self.allowed_actions = [Action.GET_PRODUCT, Action.UPDATE_USER_PROFILE]
    def has_access(self, action: Action) -> bool:
        return action in self.allowed_actions
