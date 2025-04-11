// components/Header.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, UserCircle, Home, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // Trạng thái của menu hamburger
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!mounted) {
        return null;
    }
    const handleLogout = () => {
        setIsMenuOpen(false);
        localStorage.removeItem("user");
        setUser(null);
        router.refresh();
    };

    return (
        <nav className="bg-orange-500 shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap  items-center gap-4">

                {/* Logo - hiển thị trên desktop */}
                <Link href="/" className="hidden lg:flex">
                    <img
                        src="/images/logo_slogan.png"
                        className="w-64 h-20"
                        alt="Logo"
                    />
                </Link>

                {/* Logo - hiển thị ở giữa khi mobile */}
                <div className="flex w-full justify-center lg:hidden">
                    <Link href="/">
                        <img
                            src="/images/logo_slogan.png"
                            className="h-16"
                            alt="Logo"
                        />
                    </Link>
                </div>



                <div className="flex-grow mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            className="w-full px-4 py-2 pl-10 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300 text-sm text-gray-700"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                        </svg>
                    </div>
                </div>


                {/* Icon hamburger */}
                <button
                    className="block lg:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
                </button>

                {/* Desktop navigation */}
                <div className="hidden lg:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                    >
                        <Home className="w-5 h-5 mr-1" /> Trang chủ
                    </Link>

                    <Link
                        href="/cart"
                        className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                    >
                        <ShoppingCart className="w-5 h-5 mr-1" /> Giỏ hàng
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            {/* Thẻ thông tin user */}
                            <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 rounded-full shadow-sm">
                                <UserCircle className="w-6 h-6 text-blue-600" />
                                <span className="text-gray-800 font-semibold">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-5 h-5 text-red-500" />
                                </button>
                            </div>

                            
                        </div>


                    ) : (
                            <Link
                                href="/login"
                                className="relative inline-block px-4 py-2 text-md font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-md transform transition duration-300 ease-out hover:scale-105 hover:shadow-xl"
                            >
                                Đăng nhập
                            </Link>

                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white shadow-md py-2">
                    <div className="flex flex-col items-center space-y-4">

                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Trang chủ
                        </Link>

                        <Link
                            href="/cart"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Giỏ hàng
                        </Link>

                        {user ? (
                            <>
                                <div className="flex items-center space-x-2 text-gray-700 font-medium">
                                    <UserCircle className="w-5 h-5 text-blue-600" />
                                    <span>{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-700 font-medium"
                                    
                                >
                                    <LogOut className="w-5 h-5 mr-1" />
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-4 py-1.5 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
