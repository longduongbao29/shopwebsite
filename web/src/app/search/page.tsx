"use client";
import { useEffect, useState } from "react";
import { seachProducts } from "@/lib/api"; // import từ module API
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import ProductList from "@/components/ProductList";
import { Product } from "@/schemas/product";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Searching from "@/components/Searching";

export default function HomePage() {
    const [activeProductId, setActiveProductId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);
    const [foundProducts, setFoundProducts] = useState(false);
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    useEffect(() => {
        setMounted(true);
        setLoading(true); // Bắt đầu tìm kiếm, set loading = true

        seachProducts(query)
            .then((data) => {
                setProducts(data);
                setLoading(false); // Kết thúc tìm kiếm, set loading = false
                if (data.length !== 0) {
                    setFoundProducts(true);
                }
            })
            .catch((err) => {
                console.error("Lỗi lấy sản phẩm:", err.message);
                setLoading(false); // Dừng loading nếu có lỗi
            });
    }, [query]);

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

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
            {/* Thêm ToastContainer để hiển thị thông báo */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                pauseOnHover={false}
            />

            {/* Nội dung chính */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                

                {/* Hiển thị "Searching..." khi loading */}
                {loading ? (
                    <Searching/>
                ) : foundProducts ? (
                    <><h3 className="text-2xl font-semibold text-gray-800 mb-4">Tìm kiếm cho {query}</h3><ProductList
                            products={products}
                            handleAddToCart={handleAddToCart}
                            activeProductId={activeProductId} /></>
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
