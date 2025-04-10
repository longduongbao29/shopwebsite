// lib/api.ts

const API_BASE = "http://localhost:3001/api";

export async function loginUser(username: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Đăng nhập thất bại");
    }

    return res.json();
}

export async function getProducts() {
    const res = await fetch(`${API_BASE}/products`);

    if (!res.ok) {
        throw new Error("Không thể lấy danh sách sản phẩm");
    }

    return res.json();
}
export async function getProductById(id: string) {
    let res = await fetch(`${API_BASE}/products/${id}`, {
        cache: "no-store", // hoặc sử dụng revalidate nếu cần
    });

    if (!res.ok) {
        throw new Error("Không thể lấy thông tin sản phẩm");
    }
    res = await res.json();
    return res;
}