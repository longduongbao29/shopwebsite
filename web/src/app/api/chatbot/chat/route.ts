import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { input, chat_history } = await request.json();

        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const response = await fetch(`${backendUrl}/api/chatbot/chat`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: input,
                chat_history: chat_history,
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Chatbot không phản hồi" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            message: data.message
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        return NextResponse.json(
            { message: "Lỗi server chatbot" },
            { status: 500 }
        );
    }
}
