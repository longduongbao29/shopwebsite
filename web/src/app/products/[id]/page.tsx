import { getProductById } from "@/lib/api";
import { RatingStars } from "@/components/Rating";
import { ToastContainer } from "react-toastify";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";


type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
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
            {/* ToastContainer có thể được đặt ở đây hoặc trong một client component riêng */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                pauseOnHover={false}
            />
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
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Mobile view: Price, Mua Ngay & AddToCartButton */}
                        <div className="flex flex-col gap-3 lg:hidden mt-6">
                            <span className="flex text-2xl justify-center font-bold text-blue-600">
                                {product.price.toLocaleString()} đ
                            </span>
                            <div className="flex justify-center gap-3">
                                <BuyNowButton product={product} />
                                <AddToCartButton product={product} />
                            </div>
                        </div>

                        {/* Desktop view: Price */}
                        <div className="hidden lg:block text-3xl font-bold text-blue-600 mt-6">
                            {product.price.toLocaleString()} đ
                        </div>

                        {/* Desktop view: Fixed buttons at bottom right (Mua Ngay & AddToCartButton) */}
                        <div className="hidden lg:flex absolute bottom-8 right-8 gap-3">
                            <BuyNowButton product={product} />
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </div>

                {/* Long Description */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h2>
                    <div className="text-gray-700 space-y-4 leading-relaxed">
                        <p>
                            {product.longDescription ||
                                "Đây là phần mô tả chi tiết sản phẩm, có thể dài nhiều đoạn và hỗ trợ định dạng văn bản nếu dùng CMS như Sanity, Strapi hoặc Markdown HTML."}
                        </p>
                        <p>
                            Sản phẩm được thiết kế với chất liệu cao cấp, phù hợp với nhu cầu sử dụng hằng ngày
                            cũng như chuyên nghiệp. Bảo hành 12 tháng và hỗ trợ đổi trả trong vòng 7 ngày.
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
            </div>
        </div>
    );
}
