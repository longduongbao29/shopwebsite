import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const res = await fetch(`${backendUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(
                { message: error.message || "Đăng ký thất bại" },
                { status: 400 }
            );
        }

        const data = await res.json();

        return NextResponse.json({
            message: "Đăng ký thành công",
            user: data.user
        });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { message: "Lỗi server" },
            { status: 500 }
        );
    }
}
