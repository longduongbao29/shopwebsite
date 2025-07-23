import { UserRegister } from "@/schemas/user";

// Xác định base URL cho server và client
const getBaseURL = () => {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        // Server-side: sử dụng internal URL 
        return process.env.NEXT_PUBLIC_API_URL || "http://server:8000";
    }
    // Client-side: sử dụng public URL
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export async function loginUser(username: string, password: string) {
    const SERVER_URL = getBaseURL();
    const res = await fetch(`${SERVER_URL}/api/auth/login`, {
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
        cache: 'no-store', // Không cache auth requests
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Đăng nhập thất bại");
    }
    const data = await res.json();
    const jwtToken = data.access_token;

    // Chỉ lưu token ở client-side
    if (typeof window !== 'undefined') {
        localStorage.setItem("token", jwtToken);
    }

    return data;
}

export async function registerUser(user_register: UserRegister) {
    const SERVER_URL = getBaseURL();
    const res = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: user_register.email,
            password: user_register.password,
        }),
        cache: 'no-store', // Không cache auth requests
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Đăng ký thất bại");
    }
    const data = await res.json();
    console.log("Register response:", data);
    return data;
}