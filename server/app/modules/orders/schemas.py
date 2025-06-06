from pydantic import BaseModel


class OrderOut(BaseModel):
    id: int
    user_id: int
    status: str

    class Config:
        orm_mode = True


class Customer:
    def __init__(
        self,
        id: int,
        name: str,
        email: str,
        phone: str,
        province: str,
        district: str,
        ward: str,
        address: str,
    ):
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.province = province
        self.district = district
        self.ward = ward
        self.address = address


class OrderProduct(BaseModel):
    id: int
    product_id: int
    quantity: int

    customer: Customer

    class Config:
        orm_mode = True
    def create_from_dict(self, data: dict):
        self.id = data.get("id")
        self.product_id = data.get("product_id")
        self.quantity = data.get("quantity")
        self.customer = Customer(
            id=data.get("customer_id"),
            name=data.get("customer_name"),
            email=data.get("customer_email"),
            phone=data.get("customer_phone"),
            province=data.get("customer_province"),
            district=data.get("customer_district"),
            ward=data.get("customer_ward"),
            address=data.get("customer_address"),
        )
        return self