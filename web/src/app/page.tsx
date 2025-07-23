import { getProducts } from "@/lib/product_api";
import { Product } from "@/schemas/product";
import HomePageClient from "@/components/home-page-client";
import HomePageWrapper from "@/components/HomePageWrapper";

// Trang chủ sử dụng SSR
export default async function HomePage() {
  // Fetch dữ liệu ở server-side
  const products: Product[] = await getProducts();

  return (
    <HomePageWrapper>
      <HomePageClient products={products} />
    </HomePageWrapper>
  );
}
