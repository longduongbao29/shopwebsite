"use client";
import { useEffect, useState } from "react";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");

    // Gửi tin nhắn chào khi vào lần đầu
    useEffect(() => {
        setMessages([
            { sender: "bot", text: "Xin chào! Mình có thể giúp gì cho bạn hôm nay?" },
        ]);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        // Gọi API backend RAG
        const res = await fetch("/api/rag-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });
        const data = await res.json();

        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
        setInput("");
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg z-50"
            >
                💬
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-xl shadow-lg z-50 flex flex-col">
                    <div className="p-4 border-b font-bold text-orange-600">Hỗ trợ trực tuyến</div>
                    <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg ${msg.sender === "bot"
                                        ? "bg-gray-100 text-gray-800 self-start"
                                        : "bg-orange-100 text-right self-end"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex p-2 border-t">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border rounded-l px-2 py-1 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-r"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
