// pages/api/proxy/login.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const serviceUrl = `http://server:3001/api/login`;
    const body = await request.json()
    try {
        const response = await fetch(serviceUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body) // hoặc req.body nếu nó đã là JSON string
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
