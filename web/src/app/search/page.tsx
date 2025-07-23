import { searchProducts } from "@/lib/product_api";
import { Product } from "@/schemas/product";
import SearchPageClient from "@/components/search-page-client";

interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
        min_price?: string;
        max_price?: string;
        category?: string;
    }>;
}

// Trang tìm kiếm sử dụng SSR
export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.query || "";
    const min_price = parseInt(resolvedSearchParams.min_price || "0");
    const max_price = parseInt(resolvedSearchParams.max_price || "1000000000");
    const category = resolvedSearchParams.category ? [resolvedSearchParams.category] : [];

    // Fetch dữ liệu ở server-side
    const products: Product[] = await searchProducts(query, category, min_price, max_price);

    return (
        <SearchPageClient
            products={products}
            query={query}
            initialFoundProducts={products.length > 0}
        />
    );
}

