import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin" && password === "admin") {
            localStorage.setItem('user', JSON.stringify({ username }))
            navigate('/home')
        } else {
            alert("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
            <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl p-8 rounded-3xl w-full max-w-md text-white">
                <div className="flex justify-center mb-6">
                    <img
                        src="https://dummyimage.com/100x100/ffffff/000000&text=LOGO"
                        alt="Logo"
                        className="w-20 h-20 rounded-full border-2 border-white shadow-md"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Chào mừng trở lại</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <User className="absolute top-3 left-3 text-gray-400" size={20} />
                        <Input
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="pl-10 bg-white/70 text-black placeholder-gray-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                        <Input
                            type="password"
                            placeholder="Mật khẩu"
                            className="pl-10 bg-white/70 text-black placeholder-gray-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
                    >
                        Đăng nhập
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
