"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
export default function BackButton() {
    const router = useRouter();

    return (
       
            <button
            onClick={() => router.back()}
            className="fixed top-4 left-4 z-50 p-2 text-blue-500 hover:text-blue-800"
            >
            <ArrowLeft size={32} strokeWidth={2.5} />
            </button>
       
    );
}
