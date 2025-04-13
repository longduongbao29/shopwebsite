"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/schemas/product"; // hoặc chỉnh lại type nếu khác

export default function BuyNowButton({ product }: { product: Product }) {
    const router = useRouter();
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
