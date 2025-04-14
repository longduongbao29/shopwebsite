# Đây là file chứa các dependency dùng chung
from injector import Injector, Module


class Dependency(Module):
    def configure(self, binder):
        pass
    
    
injector = Injector(Dependency)


    