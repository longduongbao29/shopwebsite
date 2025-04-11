// src/app/api/proxy/product/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const { id } = await params;
    const serviceUrl = `http://server:3001/api/product/${id}`;
    try {
        const response = await fetch(serviceUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
        );
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Lỗi server' },
            { status: 500 }
        );
    }
}
