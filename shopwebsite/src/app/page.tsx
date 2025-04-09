"use client"
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api"; // ✅ import từ module API
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import { ShoppingCart } from "lucide-react"; // Import icon

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string; // Đảm bảo có trường image trong API sản phẩm
};

export default function HomePage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  // Đọc user và danh sách sản phẩm từ API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch product list
    getProducts()
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm:", err.message);
      });
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Navbar */}
      <Header />

      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />

      {/* Nội dung chính */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sản phẩm mới</h3>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative"
              >
                {/* Ảnh sản phẩm */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-700 mb-1">{product.name}</h4>
                  {/* <p className="text-sm text-gray-500 mb-2">{product.description}</p> */}
                  <p className="text-blue-600 font-semibold">
                    {product.price.toLocaleString()} đ
                  </p>
                </div>

                {/* Nút thêm vào giỏ hàng */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </div>
            ))
          ) : (
            <p>Đang tải sản phẩm...</p>
          )}
        </div>
      </main>
    </div>
  );
}
