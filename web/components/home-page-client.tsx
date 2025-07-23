"use client";
import { useState } from "react";
import ProductList from "@/components/ProductList";
import { Product } from "@/schemas/product";
import { toast } from "react-toastify";

interface HomePageClientProps {
    products: Product[];
}

export default function HomePageClient({ products }: HomePageClientProps) {
    const [activeProductId, setActiveProductId] = useState<number | null>(null);

    // Hàm xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product: Product) => {
        // Lấy giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Tìm xem sản phẩm đã có trong giỏ hàng chưa
        const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã có, tăng quantity lên 1
            cart[existingProductIndex].quantity += 1;
        } else {
            // Nếu sản phẩm chưa có, thêm mới với quantity = 1
            cart.push({ ...product, quantity: 1 });
        }

        // Cập nhật lại localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Hiển thị thông báo
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");

        setActiveProductId(product.id);
        setTimeout(() => setActiveProductId(null), 400);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
            {/* Nội dung chính */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sản phẩm mới</h3>
                <ProductList
                    products={products}
                    handleAddToCart={handleAddToCart}
                    activeProductId={activeProductId !== null ? activeProductId.toString() : null}
                />
            </main>
        </div>
    );
}
