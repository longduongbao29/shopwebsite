// AddToCartButton.tsx
"use client";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/schemas/product";

type Props = {
    product: Product;
};

export default function AddToCartButton({ product }: Props) {
    const handleAddToCart = (product: Product) => {
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

        // Hiển thị thông báo
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow transition"
        >
            <ShoppingCart size={24} />
            {/* <span>Thêm vào giỏ hàng</span> */}
        </button>
    );
}
