import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const res = await fetch(`${backendUrl}/api/products/get_by_id/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Cache cho product details
            next: { revalidate: 1800 } // Cache 30 minutes
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: "Không thể lấy thông tin sản phẩm" },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error('Product fetch error:', error);
        return NextResponse.json(
            { message: "Lỗi server" },
            { status: 500 }
        );
    }
}
