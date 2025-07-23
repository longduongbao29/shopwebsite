// Xác định base URL cho server và client
const getBaseURL = () => {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        // Server-side: sử dụng internal URL 
        return process.env.NEXT_PUBLIC_API_URL || "http://server:8000";
    }
    // Client-side: sử dụng public URL
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export async function getProducts() {
    try {
        const SERVER_URL = getBaseURL();
        const res = await fetch(`${SERVER_URL}/api/products/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'force-cache', // Cache cho SSR
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

export async function getProductById(id: string) {
    const SERVER_URL = getBaseURL();
    const res = await fetch(`${SERVER_URL}/api/products/get_by_id/${id}`, {
        cache: 'force-cache', // Cache cho SSR
    });
    if (!res.ok) {
        throw new Error("Không thể lấy thông tin sản phẩm");
    }

    const data = await res.json();
    return data;
}

export async function searchProducts(query: string, categories: string[], min_price: number, max_price: number) {
    try {
        const SERVER_URL = getBaseURL();
        const res = await fetch(`${SERVER_URL}/api/products/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "query": query, "categories": categories, "min_price": min_price, "max_price": max_price }),
            cache: 'no-store', // Không cache cho search
        });
        if (!res.ok) {
            throw new Error("Không thể tìm kiếm sản phẩm");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}

export async function getRatingbyProductId(productId: string): Promise<number> {
    try {
        const SERVER_URL = getBaseURL();
        const response = await fetch(`${SERVER_URL}/api/products/get_rating/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'force-cache', // Cache cho rating
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch rating for product with ID ${productId}`);
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error fetching product rating:", error);
        throw error;
    }
}
