class RecordNotFoundException(Exception):
    def __init__(self, *args, message="No record found!"):
        super().__init__(*args)
        self.message = message
