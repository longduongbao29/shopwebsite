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
        localStorage.removeItem("user");
        setUser(null);
        router.refresh();
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">🛍️ ShopWebsite</h1>

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
                        >
                            Trang chủ
                        </Link>

                        <Link
                            href="/cart"
                            className="text-gray-700 hover:text-blue-600 font-medium"
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
