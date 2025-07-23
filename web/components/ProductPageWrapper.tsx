"use client";
import { useState, useEffect, ReactNode } from "react";
import { createMountingDelay } from "@/lib/mounting";

interface ProductPageWrapperProps {
    children: ReactNode;
    productName?: string;
}

export default function ProductPageWrapper({ children }: ProductPageWrapperProps) {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Sync với Header delay
        createMountingDelay(100).then(() => {
            setMounted(true);
            setIsLoading(false);
        });
    }, []);

    // Show loading skeleton while mounting
    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Product Section Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row gap-4">

                        {/* Image Skeleton */}
                        <div className="w-full sm:w-1/2 aspect-square flex items-center justify-center bg-gray-200 animate-pulse">
                            <div className="w-64 h-64 bg-gray-300 rounded"></div>
                        </div>

                        {/* Product Info Skeleton */}
                        <div className="w-full sm:w-1/2 p-4 relative flex flex-col justify-between gap-4">
                            <div className="space-y-3">
                                {/* Title skeleton */}
                                <div className="h-8 bg-gray-300 rounded animate-pulse"></div>

                                {/* Rating skeleton */}
                                <div className="flex items-center gap-8 mt-2">
                                    <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                                </div>

                                {/* Details skeleton */}
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="w-28 h-4 bg-gray-300 rounded animate-pulse mr-4"></div>
                                            <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price skeleton */}
                            <div className="h-8 w-40 bg-gray-300 rounded animate-pulse mt-4"></div>

                            {/* Buttons skeleton */}
                            <div className="flex gap-2 mt-4">
                                <div className="w-24 h-10 bg-blue-300 rounded animate-pulse"></div>
                                <div className="w-32 h-10 bg-orange-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
                            <div className="h-4 bg-gray-300 rounded animate-pulse w-3/5"></div>
                        </div>
                    </div>

                    {/* Comments Skeleton */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border-b pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    <div className="w-32 h-3 bg-gray-300 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
