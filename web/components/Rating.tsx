import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;

    return (
        <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={20}
                    className={
                        index < filledStars
                            ? "text-yellow-400 fill-yellow-400"
                            : halfStar && index === filledStars
                                ? "text-yellow-400 fill-yellow-400/50"
                                : "text-gray-300"
                    }
                />
            ))}
            <span className="ml-2 text-sm text-gray-600">
                {(rating ?? 0).toFixed(1)} / 5
            </span>
        </div>
    );
}
