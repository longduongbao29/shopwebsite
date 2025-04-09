"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ShoppingCart, Trash2 } from "lucide-react"; // Thêm icon thùng rác

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
};

export default function CartPage() {
    const [cart, setCart] = useState<Product[]>([]);

    // Đọc giỏ hàng từ localStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = (productId: number) => {
        const updatedCart = cart.filter((product) => product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    // Tính tổng giá trị giỏ hàng
    const totalPrice = cart.reduce((total, product) => total + product.price, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
            {/* Navbar */}
            <Header />

            {/* Nội dung chính */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Giỏ hàng của bạn</h3>

                {/* Giỏ hàng trống */}
                {cart.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-xl shadow-md">
                        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400" />
                        <p className="text-gray-600 mt-4">Giỏ hàng của bạn trống. Hãy thêm sản phẩm vào giỏ hàng!</p>
                    </div>
                ) : (
                    <div>
                        {/* Danh sách sản phẩm trong giỏ */}
                            <div className="space-y-4">
                                {cart.map((product, index) => (
                                    <div
                                        key={`${product.id}-${index}`} // Sử dụng kết hợp giữa id và index để tạo key duy nhất
                                        className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                            <div>
                                                <h4 className="text-lg text-gray-700 font-bold">{product.name}</h4>
                                                <p className="text-sm text-gray-500">{product.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <p className="text-blue-600 font-semibold">
                                                {product.price.toLocaleString()} đ
                                            </p>

                                            <button
                                                onClick={() => handleRemoveFromCart(product.id)}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        {/* Tổng tiền giỏ hàng */}
                        <div className="mt-6 flex justify-between bg-gray-100 p-4 rounded-xl shadow-md">
                            <h4 className="text-xl font-semibold text-gray-700">Tổng tiền</h4>
                            <span className="text-blue-600 font-semibold text-lg">
                                {totalPrice.toLocaleString()} đ
                            </span>
                        </div>

                        {/* Thanh toán */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => alert("Đặt hàng thành công!")}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
