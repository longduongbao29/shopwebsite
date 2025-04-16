export interface Product {
    name: string;
    id: number;
    product_name: string;
    price: number;
    description: string;
    image: string;
    category: string[]; // multi=True indicates an array
    brand: string;
    size: string[]; // multi=True indicates an array
    color: string[]; // multi=True indicates an array
    stock: number;
    original: string;
    created_at: Date;
    updated_at: Date;
}
