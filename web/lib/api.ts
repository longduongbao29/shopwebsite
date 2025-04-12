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


// lib/api.ts

export interface ChatMessage {
    role: "user" | "AI" | string;
    message: string;
}

export interface ChatRequest {
    use_retrieve: boolean;
    messages: ChatMessage[];
    model_name: string;
    temperature: number;
    instruction: string;
}

/**
 * Gửi yêu cầu chat tới API
 * @param userMessage - Tin nhắn nhập từ phía người dùng
 * @returns Promise với kết quả trả về từ API
 */
export async function sendChatRequest(messages: ChatMessage[]): Promise<ChatMessage> {
    const payload: ChatRequest = {
        use_retrieve: true,
        messages: messages,
        model_name: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.5,
        instruction: `***Role***:
You are L’s Peter, a friendly, knowledgeable, and helpful virtual assistant for BuyMe Shop, an online store that offers a variety of quality clothes products.

***Mission***:
Your main mission is to support customers throughout their shopping journey at BuyMe Shop. You help them find the right products, answer their questions, and guide them through the purchase process smoothly and efficiently.

***Key Responsibilities***:

- Product Recommendations:

Ask customers about their preferences, needs, or occasions to suggest suitable products.

Provide details such as price, features, materials, sizes, and availability.

- Customer Support:

Answer questions about shipping, returns, payment methods, promotions, and product details.

Assist with order tracking and resolving basic issues related to purchases.

- Purchase Guidance:

Guide customers through adding products to cart, checking out, and completing their purchase.

Provide friendly reminders about discounts, deals, or items left in the cart.

- Tone and Personality:

Always be polite, approachable, and enthusiastic.

Keep your language clear, professional, and engaging.

Aim to make the shopping experience as pleasant and easy as possible.

***Limitations***:

Do not make promises you can’t verify (e.g. delivery dates unless provided).

Avoid giving medical, legal, or financial advice unrelated to the shop’s products.

***Example Greeting***:
"Hi there! I'm L’s Peter, your shopping assistant from BuyMe Shop. 😊
How can I help you find the perfect item today?"`
    };

    try {
        const response = await fetch("https://chatbotonline.site/api/chat_with_instruction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const res_json = await response.json()
        const chat_msg : ChatMessage = {"role": "AI","message":res_json.answer}
        return chat_msg;
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    } finally {
        const last_msg = messages[messages.length - 1];
        console.log("Last msg: ", last_msg);
        
        const behavior = await analyzeBehavior(last_msg.message);
        console.log("behavior: ", behavior);
    }
}

export interface Behavior{
    behavior: string;
    params: string;
}
export async function analyzeBehavior(message: string): Promise<Behavior> {
    const _msg: ChatMessage[] = [{ role: "user", message: message.trim() }]
    const payload: ChatRequest = {
        use_retrieve: false,
        messages: _msg,
        model_name: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.5,
        instruction: `You are an expert in analyzing customer intent for an online clothing store. Your task is to determine what the customer wants to do based on their message.

Possible behaviors:
- search: searching for a product (params: product name)
- new_product: browsing new arrivals
- trending: viewing trending products
- price: checking the price of a product (params: product name)

Return the result in the following format:
{{"behavior":behavior_name_if_any, "params":parameter_value_if_any}}

Example:
User: "I want to see new arrivals"
Return: {{"behavior":"new_product", "params":null}}

If customer dont intent do anything, reutrn {{"behavior":null, "params":null}}
Do not provide any explanation. Only return the result exactly in the specified format.`
    };

    try {
        const response = await fetch("https://chatbotonline.site/api/chat_with_instruction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const behavior = await response.json();
        let behavior_json = null;

        if (typeof behavior.answer === 'string') {
            try {
                behavior_json = JSON.parse(behavior.answer);

            } catch (error) {
                console.error("Invalid JSON format in behavior.answer:", error);
            }
        } else {
            behavior_json = behavior.answer;
            console.warn("behavior.answer is not a string:", behavior.answer);
        }
        return await behavior_json;
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}
