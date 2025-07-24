import { Product, RatingResponse } from '@/schemas/product';

// Helper function để get backend URL cho server-side calls
const getBackendURL = () => {
    return process.env.BACKEND_URL || "http://server:8000";
};

// Server-side function gọi trực tiếp backend
export async function getProducts() {
    try {
        const SERVER_URL = getBackendURL();
        const res = await fetch(`${SERVER_URL}/api/products/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 3600, // Cache 1 hour cho SSR
                tags: ['products'] // Tag để có thể revalidate
            },
        });

        if (!res.ok) {
            throw new Error("Không thể lấy danh sách sản phẩm");
        }
        const data = await res.json();

        return data;
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProduct(id: number): Promise<Product | null> {
    try {
        const SERVER_URL = getBackendURL();
        const res = await fetch(`${SERVER_URL}/api/products/get_by_id/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 1800, // Cache 30 minutes cho SSR
                tags: ['product', `product-${id}`] // Tags để có thể revalidate specific product
            },
        });

        if (!res.ok) {
            throw new Error("Không thể lấy thông tin sản phẩm");
        }

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function searchProducts(query: string, category: string[], min_price: number, max_price: number): Promise<Product[]> {
    try {
        const SERVER_URL = getBackendURL();
        const res = await fetch(`${SERVER_URL}/api/products/search/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, category, min_price, max_price }),
            cache: 'no-store', // Không cache search results
        });

        if (!res.ok) {
            throw new Error("Không thể tìm kiếm sản phẩm");
        }

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}

export async function getRating(id: number): Promise<RatingResponse[]> {
    try {
        const SERVER_URL = getBackendURL();
        const res = await fetch(`${SERVER_URL}/api/products/get_rating/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 900, // Cache 15 minutes cho ratings
                tags: ['ratings', `rating-${id}`] // Tags để có thể revalidate specific rating
            },
        });

        if (!res.ok) {
            throw new Error("Không thể lấy đánh giá sản phẩm");
        }

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching rating:", error);
        return [];
    }
}

// Aliases để match với existing code
export async function getProductById(id: string): Promise<Product | null> {
    return getProduct(Number(id));
}

export async function getRatingbyProductId(id: string): Promise<RatingResponse[]> {
    return getRating(Number(id));
}
