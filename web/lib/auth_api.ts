import { UserRegister } from "@/schemas/user";

export async function loginUser(username: string, password: string) {
    // Gọi Next.js API route thay vì trực tiếp backend
    const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
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
    // Gọi Next.js API route thay vì trực tiếp backend
    const res = await fetch(`/api/auth/register`, {
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