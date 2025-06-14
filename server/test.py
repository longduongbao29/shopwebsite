from app.core.config import Config
from app.modules.products.models import ProductDocument, Category, Size
from app.db.ElasticSearch import ElasticSearch
from app.modules.chatbot.embedding.Embedding import Embedding


es = ElasticSearch(config=Config())

products = [
    {
        "product_name": "Áo khoác thể thao nam",
        "price": 750000.0,
        "description": "Áo khoác chất liệu vải gió, chống nước nhẹ, thích hợp cho hoạt động ngoài trời.",
        "image": "img",
        "category": [Category.JACKET.value],
        "brand": "Nike",
        "size": [Size.L.value],
        "original": "Vietnam",
        "color": ["Đen", "hồng cánh sen"],
        "stock": 42,
    },
    {
        "product_name": "Quần jeans nữ",
        "price": 550000.0,
        "description": "Quần jeans co giãn, phù hợp cho mọi hoạt động hàng ngày.",
        "image": "img",
        "category": [Category.PANTS.value],
        "brand": "Levi's",
        "size": [Size.M.value],
        "original": "Vietnam",
        "color": ["Xanh"],
        "stock": 30,
    },
    {
        "product_name": "Áo thun nam cổ tròn",
        "price": 250000.0,
        "description": "Áo thun cotton mềm mại, thoáng mát, phù hợp cho mùa hè.",
        "image": "img",
        "category": [Category.TSHIRT.value],
        "brand": "Adidas",
        "size": [Size.XL.value],
        "original": "Vietnam",
        "color": ["Trắng"],
        "stock": 50,
    },
    {
        "product_name": "Váy dạ hội nữ",
        "price": 1200000.0,
        "description": "Váy dạ hội sang trọng, thiết kế tinh tế, phù hợp cho các buổi tiệc.",
        "image": "img",
        "category": [Category.DRESS.value],
        "brand": "Gucci",
        "size": [Size.S.value],
        "original": "Vietnam",
        "color": ["Đỏ"],
        "stock": 10,
    },
    {
        "product_name": "Giày thể thao nam",
        "price": 900000.0,
        "description": "Giày thể thao êm ái, hỗ trợ tốt cho các hoạt động thể thao.",
        "image": "img",
        "category": [Category.SHOES.value],
        "brand": "Puma",
        "size": [Size.L.value],
        "original": "Vietnam",
        "color": ["Xám"],
        "stock": 25,
    },
    {
        "product_name": "Áo sơ mi nữ",
        "price": 450000.0,
        "description": "Áo sơ mi thanh lịch, phù hợp cho môi trường công sở.",
        "image": "img",
        "category": [Category.SHIRT.value],
        "brand": "Zara",
        "size": [Size.M.value],
        "original": "Vietnam",
        "color": ["Hồng"],
        "stock": 35,
    },
    {
        "product_name": "Quần short nam",
        "price": 300000.0,
        "description": "Quần short thoải mái, phù hợp cho các hoạt động ngoài trời.",
        "image": "img",
        "category": [Category.SHORTS.value],
        "brand": "Uniqlo",
        "size": [Size.L.value],
        "original": "Vietnam",
        "color": ["Xanh lá"],
        "stock": 40,
    },
    {
        "product_name": "Áo hoodie nữ",
        "price": 650000.0,
        "description": "Áo hoodie ấm áp, thiết kế trẻ trung, phù hợp cho mùa đông.",
        "image": "img",
        "category": [Category.HOODIE.value],
        "brand": "H&M",
        "size": [Size.S.value],
        "original": "Vietnam",
        "color": ["Tím"],
        "stock": 20,
    },
    {
        "product_name": "Mũ lưỡi trai",
        "price": 150000.0,
        "description": "Mũ lưỡi trai thời trang, bảo vệ tốt dưới ánh nắng mặt trời.",
        "image": "img",
        "category": [Category.ACCESSORY.value],
        "brand": "New Era",
        "size": [Size.SM.value],
        "original": "Vietnam",
        "color": ["Đen"],
        "stock": 60,
    },
    {
        "product_name": "Túi xách nữ",
        "price": 850000.0,
        "description": "Túi xách thời trang, thiết kế hiện đại, phù hợp cho mọi dịp.",
        "image": "img",
        "category": [Category.BAG.value],
        "brand": "Chanel",
        "size": [Size.M.value],
        "original": "Vietnam",
        "color": ["Trắng"],
        "stock": 15,
    },
]
embedding = Embedding(config=Config())
for product_data in products:
    product = ProductDocument(**product_data)
    product.save(embedding)

print("✅ Đã index 10 sản phẩm quần áo thành công!")
