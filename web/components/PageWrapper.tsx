"use client";
import { useState, useEffect, ReactNode } from "react";
import { createMountingDelay } from "@/lib/mounting";

interface PageWrapperProps {
    children: ReactNode;
    pageTitle?: string;
}

export default function PageWrapper({ children }: PageWrapperProps) {
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
                <div className="max-w-6xl mx-auto">
                    {/* Page Header Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 border-b">
                                    <div className="w-16 h-16 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                    <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
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
