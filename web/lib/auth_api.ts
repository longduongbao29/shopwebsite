import { UserRegister } from "@/schemas/user";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";


export async function loginUser(username: string, password: string) {
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
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Đăng nhập thất bại");
    }
    const data = await res.json();
    const jwtToken = data.access_token;
    localStorage.setItem("token", jwtToken);


    return data;
}

export async function registerUser(user_register: UserRegister) {

    const res = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: user_register.email,
            password: user_register.password,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Đăng ký thất bại");
    }
    const data = await res.json();
    console.log("Register response:", data);
    return data;
}