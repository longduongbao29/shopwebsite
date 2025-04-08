// src/layouts/MainLayout.tsx
import Header from "../components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header /> {/* <-- Sử dụng header thông minh có logic đăng nhập */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
