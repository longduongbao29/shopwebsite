"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BotAssistant from "@/components/BotAssistant";
import { ToastContainer } from "react-toastify";

export function ClientComponents() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Đảm bảo tất cả components mount cùng lúc
        const timer = setTimeout(() => {
            setMounted(true);
        }, 50); // Small delay để sync với Header component

        return () => clearTimeout(timer);
    }, []);

    // Always render something để tránh layout shift
    return (
        <>
            <Header />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                pauseOnHover={false}
            />
            {mounted && <BotAssistant />}
        </>
    );
}
