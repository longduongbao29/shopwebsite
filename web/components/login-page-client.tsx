"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { loginUser } from "@/lib/auth_api";
import { toast } from "react-toastify";

export default function LoginPageClient() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await loginUser(email, password);
            toast.success("Đăng nhập thành công!");
            document.dispatchEvent(new CustomEvent("header:update"));
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200 text-white font-semibold py-2 rounded-lg shadow-md"
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
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
