"use client";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { fetchDistricts, fetchProvinces, fetchWards, getProductById } from "@/lib/api";
import { Province, District, Ward } from "@/schemas/map";
import { Product } from "@/schemas/product";


export default function OrderPage({ id }: { id: string }) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderItems, setOrderItems] = useState<Product[]>([]);

  // State cho các ô lựa chọn địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");

  
  // Load dữ liệu giỏ hàng từ localStorage khi component mount
  async function fetchCart() {
    let storedCart: Product[];
    if (id!=undefined) {
      const product = (await getProductById(id)).product;
      storedCart = [{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity: 1
      }]
    } else {
      storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log(storedCart);
    }
    setOrderItems(storedCart);
    }
    
  useEffect(() => {
    fetchCart();
  }, []);

  // Tính tổng tiền dựa trên orderItems
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
    console.log("Đơn hàng đã được gửi:", {
      userInfo,
      orderItems,
      totalAmount,
      paymentMethod,
      selectedProvince,
      selectedDistrict,
      selectedWard,
    });
  };

  // Lấy danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    async function getProvinces() {
      const provincesData = await fetchProvinces();
      setProvinces(provincesData);
    }
    getProvinces();
  }, []);

  // Khi chọn tỉnh thành, load các quận/huyện tương ứng
  useEffect(() => {
    if (selectedProvince) {
      async function getDistricts() {
        const districtsData = await fetchDistricts(selectedProvince);
        setDistricts(districtsData);
      }
      getDistricts();
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedWard("");
  }, [selectedProvince]);

  // Khi chọn quận huyện, load các phường/xã tương ứng
  useEffect(() => {
    if (selectedDistrict) {
      async function getWards() {
        const wardsData = await fetchWards(selectedDistrict);
        setWards(wardsData);
      }
      getWards();
    } else {
      setWards([]);
    }
    setSelectedWard("");
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <h2 className="text-3xl md:text-4xl font-semibold text-blue-900 text-center mb-8">
        Đơn hàng
      </h2>
      {/* Layout 2 cột, ở medium trở lên: */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột trái: Thông tin người đặt hàng */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Thông tin người đặt hàng</h3>
          {/* Họ và tên */}
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={userInfo.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userInfo.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Số điện thoại */}
          <div className="relative">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={userInfo.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại của bạn"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Các ô lựa chọn địa chỉ */}
          <div className="grid grid-cols-1 gap-4">
            {/* Tỉnh/Thành phố */}
            <div className="relative">
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                id="province"
                name="province"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              >
                <option value="" key="default-province">
                  Chọn tỉnh/thành phố
                </option>
                {provinces.map((province: Province) => (
                  <option key={province.province_id} value={province.province_id}>
                    {province.province_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Quận/Huyện */}
            <div className="relative">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                name="district"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              >
                <option value="" key="default-district">
                  Chọn quận/huyện
                </option>
                {districts.map((district: District) => (
                  <option key={district.district_id} value={district.district_id}>
                    {district.district_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Phường/Xã */}
            <div className="relative">
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <select
                id="ward"
                name="ward"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
              >
                <option value="" key="default-ward">
                  Chọn phường/xã
                </option>
                {wards.map((ward: Ward) => (
                  <option key={ward.ward_id} value={ward.ward_id}>
                    {ward.ward_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Địa chỉ đầy đủ */}
          <div className="relative">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ đầy đủ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={userInfo.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ của bạn"
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Cột phải: Thông tin đơn hàng, phương thức thanh toán, nút xác nhận */}
        <div className="space-y-6">
          {/* Thông tin đơn hàng */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                    <span className="text-gray-700 text-sm">{item.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-right">
                    <span className="text-gray-500 text-xs">
                      {item.quantity} x {item.price.toLocaleString()} đ
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {(item.quantity * item.price).toLocaleString()} đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-base font-semibold text-gray-900">
              <span>Tổng tiền</span>
              <span>{totalAmount.toLocaleString()} đ</span>
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href="/cart"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <FaShoppingCart size={16} />
                <span>Quản lý giỏ hàng</span>
              </a>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="text-blue-600"
                />
                <span className="text-gray-700 text-sm">Thanh toán khi nhận hàng</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="text-blue-600"
                />
                <span className="text-gray-700 text-sm">Thanh toán online</span>
              </label>
             
            </div>
          </div>

          {/* Nút xác nhận đơn hàng */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex justify-center">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 text-white text-base font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Xác nhận đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
