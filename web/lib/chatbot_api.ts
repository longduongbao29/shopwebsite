import { ChatMessage } from "@/schemas/chatbot";

export async function sendChatRequest(messages: ChatMessage[]): Promise<ChatMessage> {
    try {
        const history_chat = JSON.stringify(messages.slice(0, messages.length - 1));

        // Gọi Next.js API route thay vì trực tiếp backend
        const response = await fetch(`/api/chatbot/chat`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: messages[messages.length - 1].message,
                chat_history: history_chat,
            }),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const res_json = await response.json();
        const chat_msg: ChatMessage = { "role": "AI", "message": res_json.message };

        return chat_msg;
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}

export async function randomMessage(): Promise<string> {
    try {
        // Gọi Next.js API route thay vì trực tiếp backend
        const response = await fetch(`/api/chatbot/random`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const res_json = await response.json();
        return res_json.message;
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}
