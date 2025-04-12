"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/schemas/product"; // hoặc chỉnh lại type nếu khác

export default function BuyNowButton({ product }: { product: Product }) {
    const router = useRouter();
    const addToCart = (product: Product) => {
            // Lấy giỏ hàng từ localStorage
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);
    
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            // Cập nhật lại localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        
        };
    const handleBuyNow = (product: Product) => {
        router.push(`/order/${product.id}`); // Chuyển sang trang giỏ hàng
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBuyNow(product);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
            Mua Ngay
        </button>
    );
}
