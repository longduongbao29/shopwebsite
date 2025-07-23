import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const res = await fetch(`${backendUrl}/api/products/get_rating/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Cache rating data
            next: { revalidate: 900 } // Cache 15 minutes
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: `Failed to fetch rating for product with ID ${id}` },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error('Product rating fetch error:', error);
        return NextResponse.json(
            { message: "Lỗi server" },
            { status: 500 }
        );
    }
}
