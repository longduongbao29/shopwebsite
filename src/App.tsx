// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MainLayout from "./layouts/MainLayout";
import Header from "./components/Header";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetailPage />
            </MainLayout>
          }
        />
        <Route path="/home" element={
          <>
            <Header />
            <HomePage />
          </>
        } />
      </Routes>
    </Router>
  );
}
