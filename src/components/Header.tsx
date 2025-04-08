// File: src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser?.username) {
      setUsername(storedUser.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUsername(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MyShop
      </Link>

      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav
        className={`absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent md:flex md:items-center md:gap-6 border-t md:border-0 ${isMenuOpen ? "block" : "hidden"
          }`}
      >
        <Link to="/home" className="block px-4 py-2 hover:text-blue-600">
          Trang chủ
        </Link>

        {!username ? (
          <Link to="/login" className="block px-4 py-2 hover:text-blue-600">
            Đăng nhập
          </Link>
        ) : (
          <>
            <span className="block px-4 py-2 text-sm text-gray-600">
              👋 Xin chào, <strong>{username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-red-500 hover:text-red-700"
            >
              Đăng xuất
            </button>
          </>
        )}

        <Link to="/cart" className="block px-4 py-2 hover:text-blue-600 flex items-center">
          <ShoppingCart className="mr-1" size={18} />
          Giỏ hàng
        </Link>
      </nav>
    </header>
  );
}
