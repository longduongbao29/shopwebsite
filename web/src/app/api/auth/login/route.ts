import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Gọi backend từ server-side
        const backendUrl = process.env.BACKEND_URL || "http://server:8000";
        const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "password",
                username: username,
                password: password,
                scope: "",
                client_id: "string",
                client_secret: "string",
            }).toString(),
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(
                { message: error.message || "Đăng nhập thất bại" },
                { status: 401 }
            );
        }

        const data = await res.json();

        // Trả về token cho client
        return NextResponse.json({
            access_token: data.access_token,
            token_type: data.token_type,
            user: data.user
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: "Lỗi server" },
            { status: 500 }
        );
    }
}
