export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string; // Đảm bảo có trường image trong API sản phẩm
    quantity: number;
    rating: number;
};
