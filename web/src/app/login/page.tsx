"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            localStorage.setItem("user", JSON.stringify(response.user));
            window.location.href = "/";;
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100">
            <div className="relative w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg">
                
                <h1 className="text-3xl font-extrabold text-center text-orange-500 mb-6 flex items-center justify-center gap-2">
                    <img src="/logo.ico" alt="BuyMe icon" className="w-16 h-16" />
                    BUYME
                </h1>

                <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
                    Đăng nhập vào tài khoản
                </h2>
                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                )}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                        <Mail className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full outline-none text-gray-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                        <Lock className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full outline-none text-gray-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-2 rounded-lg shadow-md"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Chưa có tài khoản?{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => router.push("/register")}>
                        Đăng ký ngay
                    </span>
                </p>
            </div>
        </div>
    );
}
