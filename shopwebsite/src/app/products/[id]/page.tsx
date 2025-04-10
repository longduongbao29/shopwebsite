// app/products/[id]/page.tsx
import * as React from 'react'
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/api";

// Kiểu dữ liệu sản phẩm
type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
};

export default async function ProductPage({ params }) {
    // Gọi API lấy thông tin sản phẩm theo id
    const { id } = await params
    const data = await getProductById(id); // ✅ OK với Server Component
    const product: Product = data.product;
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl rounded-lg">
                    <div className="lg:flex">
                        <div className="lg:flex-shrink-0">
                            <img
                                className="h-64 w-full object-cover sm:h-80 lg:h-full lg:w-96"
                                src={product.image}
                                alt={product.name}
                                width={384}
                                height={512}
                            />

                        </div>
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900">{product.name}</h2>
                                <p className="mt-4 text-lg text-gray-600">{product.description}</p>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-4xl font-bold text-blue-600">
                                    {product.price.toLocaleString()} đ
                                </span>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xl font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/"
                                    className="text-blue-600 font-medium text-lg hover:underline"
                                >
                                    ← Quay lại danh sách sản phẩm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}