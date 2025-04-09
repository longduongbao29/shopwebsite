// src/app/admin/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
    );
}
