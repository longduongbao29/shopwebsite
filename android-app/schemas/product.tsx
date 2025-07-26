export interface Product {
    id: number;
    product_name: string;
    name?: string; // Keep for backward compatibility
    description: string;
    price: number;
    image: string;
    category: string[];
    brand: string;
    size: string[];
    color: string[];
    stock: number;
    original: string;
    created_at: string;
    updated_at: string;
    average_rating: number;
    total_rating: number;
    quantity?: number; // For cart functionality
    rating?: number; // Keep for backward compatibility
};
