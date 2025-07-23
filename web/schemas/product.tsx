export interface Product {
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
    average_rating: number;
    total_rating: number;
    original: string;
    created_at: Date;
    updated_at: Date;
}

export interface ProductOrder {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    image: string;
}
export interface Rating {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string;
    created_at: Date;
}

// Type cho response của rating API
export interface RatingResponse {
    user_name: string;
    created_at: string;
    comment: string;
    rating: number;
}