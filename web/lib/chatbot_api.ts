import { ChatMessage } from "@/schemas/chatbot";  

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";


export async function sendChatRequest(messages: ChatMessage[]): Promise<ChatMessage> {

    try {
        const history_chat = JSON.stringify(messages.slice(0, messages.length - 1));

        const response = await fetch(`${SERVER_URL}/api/chatbot/chat`, {
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
        const res_json = await response.json()
        const chat_msg: ChatMessage = { "role": "AI", "message": res_json.message }

        return chat_msg;
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}

export async function randomMessage(): Promise<string> {

    try {
        const response = await fetch(`${SERVER_URL}/api/chatbot/random_chat`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const res_json = await response.json()

        return res_json.message
    } catch (error) {
        console.error("Error while sending chat request:", error);
        throw error;
    }
}
