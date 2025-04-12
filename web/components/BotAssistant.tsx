"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { sendChatRequest, ChatMessage , randomMessage} from "@/lib/api";
import { useRef } from "react";

export default function BotAssistant() {
    const [showMessage, setShowMessage] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatBottom, setChatBottom] = useState("0rem"); // Giá trị mặc định cho desktop
    const [randMessage, setRandomMessage] = useState("Chào bạn, bạn cần giúp gì không!!!")
    const [isBotVisible, setIsBotVisible] = useState(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Kiểm tra kích thước màn hình (mobile)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Lắng nghe sự thay đổi của viewport khi bàn phím ảo xuất hiện trên mobile
    // Đặt giá trị bottom mặc định, ví dụ "1rem" hoặc giá trị khác phù hợp
    const defaultBottom = "0rem";

    useEffect(() => {
        if (isMobile && window.visualViewport) {
            const onViewportResize = () => {
                const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                // Nếu chiều cao viewport bằng chiều cao của cửa sổ, nghĩa là bàn phím tắt
                if (viewportHeight === window.innerHeight) {
                    setChatBottom(defaultBottom);
                
                } else {
                    // Tính khoảng cách bị trừ đi do bàn phím xuất hiện
                    const bottomOffset = window.innerHeight - viewportHeight;
                    // Cộng thêm khoảng đệm (ví dụ 16px) để modal hiển thị hợp lý
                    setChatBottom(`${bottomOffset}px`);
                
                }
            };
            window.visualViewport.addEventListener("resize", onViewportResize);
            return () => {
                if (window.visualViewport) {
                    window.visualViewport.removeEventListener("resize", onViewportResize);
                }
            };
        }
    }, [isMobile, defaultBottom]);



    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showMessage) {
            timeout = setTimeout(() => setShowMessage(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [showMessage]);

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(async () => {
            const randomMsg = await randomMessage();
            setRandomMessage(randomMsg);
            setShowMessage(true);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Mở cửa sổ chat khi click vào icon bot
    const handleBotClick = () => {
        setChatOpen(true);
    };

    // Đóng cửa sổ chat
    const closeChat = () => {
        setChatOpen(false);
    };

    // Cập nhật message khi người dùng nhập
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    // Gửi tin nhắn và cập nhật lịch sử chat
    const handleSendMessage = async () => {
        if (!message.trim()) return;
        const userChatMessage: ChatMessage = { role: "user", message: message.trim() };
        const updatedHistory = [...chatHistory, userChatMessage];
        setChatHistory(updatedHistory);
        setMessage("");

        try {
            const result = await sendChatRequest(updatedHistory);
            setChatHistory((prevHistory) => [...prevHistory, result]);
        } catch (error) {
            console.error("Error while sending chat request:", error);
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Modal */}
            {chatOpen && (
                <>
                    {isMobile ? (
                        <div className="fixed inset-0 z-[9999] bg-transparent backdrop-blur-sm flex justify-center items-end">
                            <div
                                className="w-11/12 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col  "
                                style={{ height: "60vh", marginBottom: chatBottom }}
                            >
                                {/* Header */}
                                <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
                                    <h3 className="text-white font-semibold">Chat Bot</h3>
                                    <button onClick={closeChat} className="text-white text-2xl focus:outline-none">
                                        &times;
                                    </button>
                                </div>

                                {/* Nội dung */}
                                <div ref={chatContainerRef} className="p-4 overflow-y-auto flex-1">

                                    <p className="mb-2 text-gray-700">Chào bạn! Mình có thể giúp gì?</p>
                                    <div className="flex flex-col space-y-2">
                                        {chatHistory.map((chat, index) => (
                                            <div
                                                key={index}
                                                className={`${chat.role === "user" ? "self-end bg-blue-600" : "self-start bg-gray-200"
                                                    } rounded-lg px-4 py-2`}
                                            >
                                                <span className={`${chat.role === "user" ? "text-white" : "text-gray-800"}`}>
                                                    {chat.message}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Phần nhập tin */}
                                <div className="px-4 py-2 bg-gray-100">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Nhập tin nhắn..."
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="fixed z-40"
                            style={{
                                right: "calc(2rem + 120px + 8px)",
                                bottom: "calc(2rem + 120px + 8px)",
                            }}
                        >
                            <div className="w-72 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: "400px" }}>
                                <div className="flex items-center justify-between bg-blue-600 px-4 py-2">
                                    <h3 className="text-white font-semibold text-sm">Chat Bot</h3>
                                    <button onClick={closeChat} className="text-white text-2xl focus:outline-none">
                                        &times;
                                    </button>
                                </div>
                                <div ref={chatContainerRef} className="p-4 overflow-y-auto flex-1">
                                    <p className="mb-2 text-gray-700 text-sm">Chào bạn! Mình có thể giúp gì?</p>
                                    <div className="flex flex-col space-y-2">
                                        {chatHistory.map((chat, index) => (
                                            <div
                                                key={index}
                                                className={`${chat.role === "user" ? "self-end bg-blue-600" : "self-start bg-gray-200"
                                                    } rounded-lg px-3 py-1`}
                                            >
                                                <span className={`${chat.role === "user" ? "text-white" : "text-gray-800"} text-xs`}>
                                                    {chat.message}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-gray-100">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="w-full px-2 py-1 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                                            placeholder="Nhập tin nhắn..."
                                        />
                                    
                                            <button
                                                onClick={handleSendMessage}
                                                className="w-full mt-2 py-1 bg-blue-600 text-white rounded-lg focus:outline-none text-xs"
                                            >
                                                Gửi
                                            </button>
                                     
                                   
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Bot Icon */}
            {isBotVisible && (
                <div
                    className="fixed z-[9999] cursor-pointer"
                    style={{
                        right: isMobile ? "1rem" : "2rem",
                        bottom: isMobile ? "1rem" : "2rem",
                    }}
                >
                    {/* Nút đóng */}
                    <button
                        onClick={() => setIsBotVisible(false)}
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                    >
                        ×
                    </button>

                    {/* Tooltip + Bot icon */}
                    <div onClick={handleBotClick}>
                        {showMessage && (
                            <div className="absolute bottom-full mb-2 right-0 bg-white text-sm text-gray-800 font-medium px-4 py-2 rounded-full shadow border whitespace-nowrap animate-fade-in">
                                {randMessage}
                            </div>
                        )}
                        <Image
                            src="/botwave.gif"
                            alt="Bot"
                            width={120}
                            height={120}
                            className="object-contain select-none w-24 sm:w-40"
                            draggable={false}
                            priority
                        />
                    </div>
                </div>
            )}
        </>
    );
}
