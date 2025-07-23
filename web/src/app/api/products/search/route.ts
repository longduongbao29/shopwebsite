import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { query, categories, min_price, max_price } = await request.json();

        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const res = await fetch(`${backendUrl}/api/products/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query,
                categories: categories,
                min_price: min_price,
                max_price: max_price
            }),
            // Không cache search results
            cache: 'no-store'
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: "Không thể tìm kiếm sản phẩm" },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error('Product search error:', error);
        return NextResponse.json(
            { message: "Lỗi server" },
            { status: 500 }
        );
    }
}
