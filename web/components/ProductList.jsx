import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react"; // Hoặc bất kỳ icon nào bạn dùng
import React from "react";

const ProductList = ({ products, handleAddToCart, activeProductId }) => {
    function ProductSkeleton() {
        return (
            <div className="animate-pulse bg-white shadow rounded-xl p-4">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.length > 0 ? (
                products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group"
                        prefetch
                    >
                        <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative flex flex-col h-full">
                            <div className="w-full aspect-[4/3] relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <h4 className="text-lg font-bold text-gray-700 mb-2 line-clamp-2">
                                    {product.name}
                                </h4>

                                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-center sm:justify-between mt-2">
                                    <p className="text-blue-600 font-semibold text-lg">
                                        {product.price.toLocaleString()} đ
                                    </p>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        className="text-blue-600 p-2 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                                    >
                                        <ShoppingCartIcon
                                            className={`w-6 h-6 text-blue-600 transition-transform ${activeProductId === product.id ? "animate-zoom-rotate" : ""
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
            )}
        </div>
    );
};

export default ProductList;
