"use client";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api"; // import từ module API
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import { ShoppingCart } from "lucide-react"; // Import icon
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string; // Đảm bảo có trường image trong API sản phẩm
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // Đọc user và danh sách sản phẩm từ API
  useEffect(() => {
    setMounted(true);

    // Fetch product list
    getProducts()
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm:", err.message);
      });
  }, []);


  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };
  function ProductSkeleton() {
    return (
      <div className="animate-pulse bg-white shadow rounded-xl p-4">
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Navbar */}


      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer
        position="top-center"       // Vị trí thông báo ở trên, căn giữa
        autoClose={3000}           // Tự động đóng sau 3 giây
        hideProgressBar={true}     // Ẩn thanh tiến trình
        newestOnTop={true}         // Thông báo mới nhất hiển thị trên cùng
        pauseOnHover={false}       // Không dừng thông báo khi hover chuột
      />

      {/* Nội dung chính */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sản phẩm mới</h3>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              // Bọc mỗi khung sản phẩm trong Link dẫn đến trang chi tiết sản phẩm.
              <Link key={product.id} href={`/products/${product.id}`} className="group" prefetch>
                <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative flex flex-col h-full">
                  <div className="w-full aspect-[4/3] relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-lg font-bold text-gray-700 mb-2 line-clamp-2">{product.name}</h4>

                    <p className="text-blue-600 font-semibold text-lg mt-auto">{product.price.toLocaleString()} đ</p>
                  </div>


                  {/* Nút thêm vào giỏ hàng */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                </div>
              </Link>

            ))
          ) : Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </main>
    </div>
  );
}
