class PermissionDeniedException(Exception):
    """
    Exception raised when a user does not have the required permissions
    to perform an action.
    """

    def __init__(self, message="Permission denied. You do not have the required access rights."):
        self.message = message
        super().__init__(self.message)