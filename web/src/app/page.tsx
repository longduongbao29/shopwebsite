"use client";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api"; // import từ module API
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import ProductList from "@/components/ProductList";
import { Product } from "@/schemas/product";

export default function HomePage() {
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
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
  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: Product) => {
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Tìm xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã có, tăng quantity lên 1
      cart[existingProductIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa có, thêm mới với quantity = 1
      cart.push({ ...product, quantity: 1 });
    }

    // Cập nhật lại localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Hiển thị thông báo
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");

    setActiveProductId(product.id);
    setTimeout(() => setActiveProductId(null), 400);
  };

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
        <ProductList
          products={products}
          handleAddToCart={handleAddToCart}
          activeProductId={activeProductId}
        />
      </main>
    </div>
  );
}
