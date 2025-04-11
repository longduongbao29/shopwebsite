// src/app/api/proxy/products/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const serviceUrl = `http://server:3001/api/products`;
    console.log('Service URL:', serviceUrl);

    try {
        const response = await fetch(serviceUrl);
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Lỗi server' },
            { status: 500 }
        );
    }
}
