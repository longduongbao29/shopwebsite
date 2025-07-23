"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
};

export default function CartPageClient() {
    const [mounted, setMounted] = useState(false);
    const [cart, setCart] = useState<Product[]>([]);

    // Đọc giỏ hàng từ localStorage
    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as Product[];
            setCart(storedCart);
        }
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId: number) => {
        const updatedCart = cart.filter((product: Product) => product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    };

    // Hàm tăng số lượng sản phẩm
    const increaseQuantity = (productId: number) => {
        const updatedCart = cart.map((product: Product) =>
            product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    // Hàm giảm số lượng sản phẩm
    const decreaseQuantity = (productId: number) => {
        const updatedCart = cart.map((product: Product) =>
            product.id === productId && product.quantity > 1
                ? { ...product, quantity: product.quantity - 1 }
                : product
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    // Tính tổng tiền
    const totalPrice = cart.reduce((total: number, product: Product) => total + product.price * product.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <ShoppingCart className="mr-3 text-blue-600" />
                    Giỏ hàng của bạn
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                            Giỏ hàng của bạn đang trống
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Khám phá sản phẩm và thêm những món đồ yêu thích vào giỏ hàng nhé!
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Danh sách sản phẩm */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((product: Product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            {product.description}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600 mt-2">
                                            {product.price.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => decreaseQuantity(product.id)}
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-semibold w-8 text-center">
                                            {product.quantity}
                                        </span>
                                        <button
                                            onClick={() => increaseQuantity(product.id)}
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                                        title="Xóa sản phẩm"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Tóm tắt đơn hàng */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Tóm tắt đơn hàng
                                </h3>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-red-600">
                                            {totalPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href="/order"
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-semibold"
                                >
                                    Tiến hành thanh toán
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block font-semibold mt-2"
                                >
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
