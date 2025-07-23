import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const response = await fetch(`${backendUrl}/api/chatbot/random_chat`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Không thể lấy tin nhắn ngẫu nhiên" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            message: data.message
        });

    } catch (error) {
        console.error('Random message error:', error);
        return NextResponse.json(
            { message: "Lỗi server" },
            { status: 500 }
        );
    }
}
