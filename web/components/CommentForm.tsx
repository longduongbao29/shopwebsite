// components/AddCommentForm.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function AddCommentForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(0);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const commentData = {
            user_name: formData.get("user_name") as string,
            rating: rating,
            comment: formData.get("comment") as string,
            product_id: productId,
        };

        await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData),
        });

        window.location.reload();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Viết bình luận của bạn</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá của bạn</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-yellow-400 hover:scale-110 transition-transform"
                        >
                            <Star
                                fill={star <= rating ? "currentColor" : "none"}
                                stroke="currentColor"
                                className="w-6 h-6"
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Bình luận</label>
                <textarea
                    name="comment"
                    rows={4}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>

            <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Gửi bình luận
            </button>
        </form>
    );
}
