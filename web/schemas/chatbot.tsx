
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
