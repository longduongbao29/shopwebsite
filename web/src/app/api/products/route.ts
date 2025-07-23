export async function GET() {
    try {
        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const res = await fetch(`${backendUrl}/api/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Next.js sẽ cache này
            next: { revalidate: 3600 } // Cache 1 hour
        });

        if (!res.ok) {
            return { message: "Không thể lấy danh sách sản phẩm" };
        }

        const data = await res.json();

        return data

    } catch (error) {
        console.error('Products fetch error:', error);
        return { message: "Lỗi server" };
    }
}
