// lib/api.ts

const API_BASE = "https://buymeshop.shop"

export async function loginUser(username: string, password: string) {
    const res = await fetch(`${API_BASE}/api/login`, {  // sửa endpoint
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
    const res = await fetch(`${API_BASE}/api/products`);  // sửa endpoint

    if (!res.ok) {
        throw new Error("Không thể lấy danh sách sản phẩm");
    }

    return res.json();
}

export async function getProductById(id: string) {
    const res = await fetch(`${API_BASE}/api/product/${id}`); 
    if (!res.ok) {
        throw new Error("Không thể lấy thông tin sản phẩm");
    }

    const data = await res.json();
    return data;
}

const MAP_URL = "https://vapi.vnappmob.com/api/v2"
import {Province, District, Ward} from "@/schemas/map"

export async function fetchProvinces() {
    try {
        const response = await fetch(`${MAP_URL}/province/`);
        const data: { results:Province[]}= await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching provinces:", error);
        return [];
    }
}


export async function fetchDistricts(provinceId: string): Promise<District[]> {
    try {
        const response = await fetch(
            `${MAP_URL}/province/district/${provinceId}`
        );
        const data: { results: District[] } = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching districts:", error);
        return [];
    }
}



export async function fetchWards(districtId: string): Promise<Ward[]> {
    try {
        const response = await fetch(
            `${MAP_URL}/province/ward/${districtId}`
        );
        const data: { results: Ward[] } = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching wards:", error);
        return [];
    }
}
import { UserRegister } from "@/schemas/user"
export async function registerUser(params: UserRegister) {
    return params
}