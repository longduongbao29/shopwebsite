"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react"; // Thêm icon thùng rác
import Link from "next/link";


type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
};

export default function CartPage() {
    const [mounted, setMounted] = useState(false);
    const [cart, setCart] = useState<Product[]>([]);

    // Đọc giỏ hàng từ localStorage
    useEffect(() => {
        setMounted(true);
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);
    if (!mounted) {
        return null;
    }

    // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = (productId: number) => {
        const updatedCart = cart.filter((product) => product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    // Hàm tăng số lượng
    const handleIncreaseQuantity = (productId: number) => {
        const updatedCart = cart.map((product) =>
            product.id === productId
                ? { ...product, quantity: product.quantity + 1 }
                : product
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Hàm giảm số lượng (tối thiểu là 1)
    const handleDecreaseQuantity = (productId: number) => {
        const updatedCart = cart.map((product) =>
            product.id === productId && product.quantity > 1
                ? { ...product, quantity: product.quantity - 1 }
                : product
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Tính tổng giá trị giỏ hàng
    const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
            {/* Nội dung chính */}
            <main className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12">
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
                                    className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
                                >
                                    <div className="flex md:flex-row items-center space-x-2 ">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div>
                                            <h4 className="text-lg md:text-sm text-gray-700 font-bold">{product.name}</h4>
            
                                        </div>
                                    </div>
                                    
                                    <div className="flex md:flex-row items-center space-x-4">
                                        <div className="flex space-x-4">
                                            {/* Nút giảm số lượng */}
                                            <button
                                                onClick={() => handleDecreaseQuantity(product.id)}
                                                className="text-blue-600 font-semibold w-6 h-6 flex items-center justify-center border border-blue-600 rounded hover:bg-blue-100"
                                            >
                                                -
                                            </button>
                                            {/* Hiển thị số lượng */}
                                            <span className="text-gray-700">{product.quantity}</span>
                                            {/* Nút tăng số lượng */}
                                            <button
                                                onClick={() => handleIncreaseQuantity(product.id)}
                                                className="text-blue-600 font-semibold w-6 h-6 flex items-center justify-center border border-blue-600 rounded hover:bg-blue-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-blue-500 font-semibold">
                                            {product.price.toLocaleString()} x {product.quantity} =
                                        </p>
                                        <p className="text-blue-500 font-semibold">
                                            {(product.price * product.quantity).toLocaleString()}
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
                                <div className="flex justify-end mt-6 mr-12">
                                    <div className="flex items-center space-x-4 text-sm text-gray-700">
                                        <h4 className="font-semibold text-lg">Tổng tiền:</h4>
                                        <span className="text-blue-700 font-semibold text-xl">
                                            {totalPrice.toLocaleString()} đ
                                        </span>
                                    </div>
                                </div>


                        </div>

                        {/* Tổng tiền giỏ hàng */}
                      
                        {/* Thanh toán */}
                        <div className="mt-4 flex justify-end mr-12">
                            <Link href={`/order`}>
                                <button
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Đặt hàng
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}