// app/order/page.tsx
"use client";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // Import icon giỏ hàng từ react-icons

type Order = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function OrderPage() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderItems] = useState<Order[]>([
    { id: 1, name: "Product 1", price: 100000, quantity: 1 },
    { id: 2, name: "Product 2", price: 150000, quantity: 2 },
  ]);

  const totalAmount = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = () => {
    // Xử lý khi người dùng submit đơn hàng (ví dụ gửi lên API)
    console.log("Đơn hàng đã được gửi:", { userInfo, orderItems, totalAmount, paymentMethod });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 sm:px-8 lg:px-12">
      <h2 className="text-4xl font-semibold text-blue-900 mb-8 text-center">Đơn hàng</h2>

      {/* Form thông tin người dùng */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mb-8 space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin người đặt hàng</h3>

        {/* Tên người dùng */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={userInfo.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
              className="w-full p-4 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
              <a
                href="/cart"
                className="flex items-center justify-center w-full py-4 bg-transparent border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-md hover:bg-gray-100 transition-all"
              >
                <FaShoppingCart size={24} className="mr-2" />
                Quản lý giỏ hàng
              </a>
          </div>

          {/* Số điện thoại */}
          <div className="relative">
            <label htmlFor="phone-number" className="block text-gray-700 font-semibold mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone-number"
              id="phone-number"
              value={userInfo.email}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại của bạn"
              className="w-full p-4 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Địa chỉ */}
          <div className="relative">
            <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
              Địa chỉ giao hàng
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={userInfo.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ của bạn"
              className="w-full p-4 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
        <div className="space-y-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-500">
                {item.quantity} x {item.price.toLocaleString()} đ
              </span>
              <span className="font-semibold text-gray-900">
                {(item.quantity * item.price).toLocaleString()} đ
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6 text-xl font-semibold text-gray-900">
          <span>Tổng tiền</span>
          <span>{totalAmount.toLocaleString()} đ</span>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
              className="text-blue-600"
            />
            <span className="text-gray-700">Thanh toán khi nhận hàng</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="text-blue-600"
            />
            <span className="text-gray-700">Thanh toán qua thẻ</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="text-blue-600"
            />
            <span className="text-gray-700">Thanh toán qua PayPal</span>
          </label>
        </div>
      </div>

      {/* Nút xác nhận đơn hàng */}
      <div className="w-full max-w-4xl mb-8">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-all"
        >
          Xác nhận đặt hàng
        </button>
      </div>

      {/* Nút quản lý giỏ hàng */}

    </div>
  );
}
