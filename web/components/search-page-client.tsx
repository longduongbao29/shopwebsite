"use client";
import { useState } from "react";
import { Product } from "@/schemas/product";
import ProductList from "@/components/ProductList";
import Link from "next/link";
import { toast } from "react-toastify";

interface SearchPageClientProps {
    products: Product[];
    query: string;
    initialFoundProducts: boolean;
}

export default function SearchPageClient({
    products,
    query,
    initialFoundProducts
}: SearchPageClientProps) {
    const [activeProductId, setActiveProductId] = useState<number | null>(null);

    const handleAddToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");

        setActiveProductId(product.id);
        setTimeout(() => setActiveProductId(null), 400);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
            <main className="max-w-6xl mx-auto px-4 py-12">
                {initialFoundProducts ? (
                    <>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            Tìm kiếm cho {query}
                        </h3>
                        <ProductList
                            products={products}
                            handleAddToCart={handleAddToCart}
                            activeProductId={activeProductId !== null ? activeProductId.toString() : null}
                        />
                    </>
                ) : (
                    <div className="h-[80vh] flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
                        <div className="mb-40 text-center animate-fade-in-up">
                            <div className="text-6xl mb-4 text-orange-500">😢</div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
                                Không tìm thấy sản phẩm nào phù hợp
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Không có kết quả cho từ khóa &quot;<span className="font-semibold">{query}</span>&quot;.<br />
                                Vui lòng thử lại với từ khóa khác nhé!
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full shadow hover:bg-orange-600 transition-transform hover:scale-105"
                            >
                                Quay lại trang chủ
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
