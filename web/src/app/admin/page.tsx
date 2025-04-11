// src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) {
            router.push("/login");
        }
    }, [router]);

    if (!mounted) {
        return null;
    }
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
    );
}
