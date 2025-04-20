// lib/api.ts

const SERVER = "https://buymeshop.shop"

export async function loginUser(username: string, password: string) {
    const res = await fetch(`${SERVER}/api/auth/login`, {
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

export async function getProducts() {
    const res = await fetch(`${SERVER}/api/products`);  // sửa endpoint

    if (!res.ok) {
        throw new Error("Không thể lấy danh sách sản phẩm");
    }
    const data = await res.json();

    return data;
}

export async function getProductById(id: string) {
    const res = await fetch(`${SERVER}/api/products/get_by_id/${id}`);
    if (!res.ok) {
        throw new Error("Không thể lấy thông tin sản phẩm");
    }

    const data = await res.json();
    return data;
}

export async function searchProducts(query: string, categories: string[], min_price: number, max_price: number) {
    try {
        const res = await fetch(`${SERVER}/api/products/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "query": query, "categories": categories, "min_price": min_price, "max_price": max_price }),
        });
        if (!res.ok) {
            throw new Error("Không thể tìm kiếm sản phẩm");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}


const MAP_URL = "https://vapi.vnappmob.com/api/v2"
import { Province, District, Ward } from "@/schemas/map"
import { Product } from "@/schemas/product";

export async function fetchProvinces() {
    try {
        const response = await fetch(`${MAP_URL}/province/`);
        const data: { results: Province[] } = await response.json();
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


// lib/api.ts

export interface ChatMessage {
    role: "user" | "AI" | string;
    message: string;
}

export interface ChatRequest {
    use_retrieve: boolean;
    tools: string[];
    messages: ChatMessage[];
    model_name: string;
    temperature: number;
    instruction: string;
}
export interface Behavior {
    behavior: string;
    params: string;
}
/**
 * Gửi yêu cầu chat tới API
 * @param userMessage - Tin nhắn nhập từ phía người dùng
 * @returns Promise với kết quả trả về từ API
 */

export async function sendChatRequest(messages: ChatMessage[]): Promise<ChatMessage> {

    try {
        const response = await fetch(`${SERVER}/api/chat_with_instruction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const res_json = await response.json()
        const chat_msg: ChatMessage = { "role": "AI", "message": res_json.answer }


        return chat_msg;
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}

export async function randomMessage(): Promise<string> {

    try {
        const response = await fetch(`${SERVER}/api/chatbot/random_chat`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const res_json = await response.json()
        // console.log(res_json);

        return res_json.message
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}

export async function getRatingbyProductId(productId: string): Promise<number> {
    try {
        const response = await fetch(`${SERVER}/api/products/get_rating/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch rating for product with ID ${productId}`);
        }

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error fetching product rating:", error);
        throw error;
    }
}
