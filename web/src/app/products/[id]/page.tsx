import Link from "next/link";
import { getProductById } from "@/lib/api";
import { ShoppingCart } from "lucide-react";
import { RatingStars } from "@/components/Rating"

type Prams = Promise<{id:string}>
export default async function ProductPage({ params }: { params:  Prams  }) {
    const { id } = await params;
    const data = await getProductById(id);
    const product = data.product;

    const comments = [
        {
            name: "Nguyễn Văn A",
            content: "Sản phẩm rất tốt, giao hàng nhanh chóng!",
            date: "2025-04-10",
        },
        {
            name: "Trần Thị B",
            content: "Chất lượng vượt mong đợi, sẽ ủng hộ lần sau!",
            date: "2025-04-09",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Product Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:flex">
                    {/* Image */}
                    <div className="lg:w-1/2 h-72 sm:h-96 lg:h-auto">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2 p-8 relative flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <RatingStars rating={product.rating} />
                            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Price + Button for mobile */}
                        <div className="flex flex-col gap-3 lg:hidden mt-6">
                            <span className="flex text-3xl  justify-center  font-bold text-blue-600">
                                {product.price.toLocaleString()} đ
                            </span>
                            <button className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 text-lg font-medium transition">
                                <ShoppingCart size={24} />
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                        </div>


                        {/* Price (desktop) */}
                        <div className="hidden lg:block text-4xl font-bold text-blue-600 mt-6">
                            {product.price.toLocaleString()} đ
                        </div>

                        {/* Button fixed bottom right on desktop */}
                        <div className="hidden lg:block absolute bottom-8 right-8">
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-4 py-2 rounded-lg shadow transition">
                                <ShoppingCart size={24} />
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Long Description */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h2>
                    <div className="text-gray-700 space-y-4 leading-relaxed">
                        <p>
                            {product.longDescription || "Đây là phần mô tả chi tiết sản phẩm, có thể dài nhiều đoạn và hỗ trợ định dạng văn bản nếu dùng CMS như Sanity, Strapi hoặc Markdown HTML."}
                        </p>
                        <p>
                            Sản phẩm được thiết kế với chất liệu cao cấp, phù hợp với nhu cầu sử dụng hằng ngày cũng như chuyên nghiệp.
                            Bảo hành 12 tháng và hỗ trợ đổi trả trong vòng 7 ngày.
                        </p>
                    </div>
                </div>

                {/* Comments */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bình luận</h2>
                    <div className="space-y-6">
                        {comments.map((comment, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="font-semibold text-gray-900">{comment.name}</div>
                                <div className="text-sm text-gray-500">{comment.date}</div>
                                <p className="mt-2 text-gray-700">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center pt-4">
                    <Link
                        href="/"
                        className="text-blue-600 text-lg font-medium hover:underline"
                    >
                        ← Quay lại danh sách sản phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
}
