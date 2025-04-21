import { getProductById, getRatingbyProductId } from "@/lib/product_api";
import { RatingStars } from "@/components/Rating";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";


type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
    const { id } = await params;
    const data = await getProductById(id);
    const product = data;

    const commentsData = await getRatingbyProductId(id);
    const comments: { user_name: string; created_at: string; comment: string; rating: number }[] = Array.isArray(commentsData) ? commentsData : [];

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Product Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:flex">
                    {/* Image */}
                    <div className="lg:w-1/3 aspect-w-1 aspect-h-1">
                        <img
                            src={product.image}
                            alt={product.product_name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-2/3 p-6 relative flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                            <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
                            <div className="flex items-center gap-8 mt-2">
                                <RatingStars rating={product.average_rating} />
                                <span className="text-gray-700 text-sm">{product.total_rating} đánh giá</span>
                            </div>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex items-center">
                                    <span className="font-semibold w-28">Thương hiệu:</span>
                                    <span>{product.brand}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-28">Danh mục:</span>
                                    <span>{product.category.join(", ")}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-28">Kích thước:</span>
                                    <span>{product.size.join(", ")}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-28">Màu sắc:</span>
                                    <span>{product.color.join(", ")}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-28">Tồn kho:</span>
                                    <span>{product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile view: Price, Mua Ngay & AddToCartButton */}
                        <div className="flex flex-col gap-2 lg:hidden mt-4">
                            <span className="flex text-xl justify-center font-bold text-blue-600">
                                {product.price.toLocaleString()} đ
                            </span>
                            <div className="flex justify-center gap-2">
                                <BuyNowButton product={product} />
                                <AddToCartButton product={product} />
                            </div>
                        </div>

                        {/* Desktop view: Price */}
                        <div className="hidden lg:block text-2xl font-bold text-blue-600 mt-4">
                            {product.price.toLocaleString()} đ
                        </div>

                        {/* Desktop view: Fixed buttons at bottom right (Mua Ngay & AddToCartButton) */}
                        <div className="hidden lg:flex absolute bottom-6 right-6 gap-2">
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
                            {product.description ||
                                "Đây là phần mô tả chi tiết sản phẩm, có thể dài nhiều đoạn và hỗ trợ định dạng văn bản nếu dùng CMS như Sanity, Strapi hoặc Markdown HTML."}
                        </p>

                    </div>
                </div>

                {/* Comments */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bình luận</h2>
                    <div className="space-y-6">
                        {comments.map((comment, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold text-gray-900">{comment.user_name}</div>
                                    <RatingStars rating={comment.rating} size={15}/>
                                </div>

                                <div className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <p className="mt-2 text-gray-700">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
