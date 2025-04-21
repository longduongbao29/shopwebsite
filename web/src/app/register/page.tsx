"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { loginUser, registerUser } from "@/lib/auth_api";
import { UserRegister } from "@/schemas/user"
import { toast } from "react-toastify";


export default function RegisterPage() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<UserRegister>({ email: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user.password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }
        try {
            await registerUser(user);
            toast.success("Đăng ký thành công!");
            try {
                await loginUser(user.email, user.password);
                document.dispatchEvent(new CustomEvent("header:update"));
        
            } catch (loginError) {
                toast.error(`Đăng nhập tự động thất bại. Vui lòng đăng nhập lại thủ công. ${loginError}`);
            }
            setTimeout(() => {
                router.push("/");
            }, 1000); // Delay navigation by 1 second
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
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
                    Đăng ký tài khoản mới
                </h2>
                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                )}
                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                        <Mail className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full outline-none text-gray-700"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                        <Lock className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full outline-none text-gray-700"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm">
                        <Lock className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            className="w-full outline-none text-gray-700"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-semibold py-2 rounded-lg shadow-md"
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Đã có tài khoản?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => router.push("/login")}
                    >
                        Đăng nhập
                    </span>
                </p>
            </div>
        </div>
    );
}
