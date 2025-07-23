"use client";
import { useState, useEffect, ReactNode } from "react";
import { createMountingDelay } from "@/lib/mounting";

interface HomePageWrapperProps {
    children: ReactNode;
}

export default function HomePageWrapper({ children }: HomePageWrapperProps) {
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
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="text-center">
                            <div className="h-10 w-80 bg-gray-300 rounded animate-pulse mx-auto mb-4"></div>
                            <div className="h-6 w-96 bg-gray-300 rounded animate-pulse mx-auto"></div>
                        </div>
                    </div>

                    {/* Products Grid Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse">
                                    {/* Image skeleton */}
                                    <div className="w-full h-48 bg-gray-300"></div>

                                    {/* Content skeleton */}
                                    <div className="p-4 space-y-3">
                                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                                        <div className="flex gap-2">
                                            <div className="h-8 bg-blue-300 rounded flex-1"></div>
                                            <div className="h-8 bg-orange-300 rounded flex-1"></div>
                                        </div>
                                    </div>
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
