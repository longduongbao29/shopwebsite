"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ClientWrapperProps {
    children: ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}

// Hook để sử dụng trong client components
export function useClientAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (loginFn: () => Promise<void>) => {
        setIsLoading(true);
        try {
            await loginFn();
            toast.success("Đăng nhập thành công!");
            document.dispatchEvent(new CustomEvent("header:update"));
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (registerFn: () => Promise<void>) => {
        setIsLoading(true);
        try {
            await registerFn();
            toast.success("Đăng ký thành công!");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleLogin, handleRegister, router };
}
