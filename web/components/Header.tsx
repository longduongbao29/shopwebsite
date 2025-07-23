// components/Header.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, UserCircle, Home, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/schemas/user";
import { createMountingDelay, safeLocalStorage } from "@/lib/mounting";
export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const router = useRouter();

    useEffect(() => {
        // Sử dụng global mounting delay để sync tất cả components
        createMountingDelay(100).then(() => {
            setMounted(true);
            setIsLoading(false);

            // Safe localStorage access
            const storage = safeLocalStorage();
            if (storage) {
                const storedToken = storage.getItem("token");
                if (storedToken) {
                    try {
                        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
                        setUser(decodedToken);
                    } catch (error) {
                        console.error("Failed to decode token:", error);
                        setUser(null);
                    }
                }
            }
        });
    }, []);

    useEffect(() => {
        if (!mounted) return; // Chỉ listen events sau khi mounted

        const handleHeaderUpdate = () => {
            const storage = safeLocalStorage();
            if (storage) {
                const storedToken = storage.getItem("token");
                if (storedToken) {
                    try {
                        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
                        setUser(decodedToken);
                    } catch (error) {
                        console.error("Failed to decode token:", error);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
        };

        document.addEventListener("header:update", handleHeaderUpdate);

        return () => {
            document.removeEventListener("header:update", handleHeaderUpdate);
        };
    }, [mounted]); // Depend on mounted state

    // Show consistent loading state để tránh flicker
    if (!mounted || isLoading) {
        return (
            <nav className="bg-orange-500 shadow-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="text-white font-bold text-xl">BuyMe Shop</div>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                    </div>
                </div>
            </nav>
        );
    }
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = searchText.trim();
        if (query !== "") {
            router.push(`/search?query=${encodeURIComponent(query)}`);
            setIsMenuOpen(false);
            // setSearchText(""); // Reset input nếu muốn
        }
    };
    const handleLogout = () => {
        setIsMenuOpen(false);
        // Safe localStorage operations
        const storage = safeLocalStorage();
        if (storage) {
            storage.removeItem("user");
            storage.removeItem("token");
        }
        import("react-toastify").then(({ toast }) => {
            toast.success("Đăng xuất thành công!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        });
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
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
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
                    </form>
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
                                <span className="text-gray-800 font-semibold">{user.email}</span>
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
                                    <span>{user.email}</span>
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
