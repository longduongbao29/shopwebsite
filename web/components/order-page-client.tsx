"use client";
import { useState, useEffect } from "react";
import { fetchDistricts, fetchProvinces, fetchWards } from "@/lib/map_api";
import { Province, District, Ward } from "@/schemas/map";
import { ProductOrder } from "@/schemas/product";
import { toast } from "react-toastify";

interface OrderPageClientProps {
    orderId?: string;
}

export default function OrderPageClient({ orderId }: OrderPageClientProps = {}) {
    const [mounted, setMounted] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [orderItems, setOrderItems] = useState<ProductOrder[]>([]);

    // State cho các ô lựa chọn địa chỉ
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedWard, setSelectedWard] = useState<string>("");

    useEffect(() => {
        setMounted(true);

        // Log orderId if provided for debugging/future implementation
        if (orderId) {
            console.log("Order ID provided:", orderId);
        }
    }, [orderId]);

    // TODO: If orderId is provided, this could be used to:
    // - Load existing order details for editing
    // - Display order confirmation/status
    // - Pre-populate form with existing order data
    // Currently defaults to new order creation from cart

    // Load dữ liệu giỏ hàng từ localStorage khi component mount
    const fetchCart = async () => {
        if (typeof window !== 'undefined') {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as ProductOrder[];
            setOrderItems(storedCart);
        }
    };

    useEffect(() => {
        if (mounted) {
            fetchCart();
        }
    }, [mounted]);

    // Tính tổng tiền dựa trên orderItems
    const totalAmount = orderItems.reduce(
        (total: number, item: ProductOrder) => total + item.price * item.quantity,
        0
    );

    const handleInputChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value } as typeof userInfo);
    };

    const handleSubmit = () => {
        // Kiểm tra thông tin đầy đủ
        if (!userInfo.name || !userInfo.email || !userInfo.address || !userInfo.phone) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            toast.error("Vui lòng chọn đầy đủ địa chỉ!");
            return;
        }

        // Lấy tên của tỉnh, quận, phường
        const provinceName = provinces.find((p: Province) => p.province_id === selectedProvince)?.province_name || "";
        const districtName = districts.find((d: District) => d.district_id === selectedDistrict)?.district_name || "";
        const wardName = wards.find((w: Ward) => w.ward_id === selectedWard)?.ward_name || "";

        const orderData = {
            userInfo,
            fullAddress: `${userInfo.address}, ${wardName}, ${districtName}, ${provinceName}`,
            paymentMethod,
            orderItems,
            totalAmount,
        };

        console.log("Đơn hàng đã được gửi:", orderData);
        toast.success("Đặt hàng thành công!");

        // Xóa giỏ hàng sau khi đặt hàng thành công
        if (typeof window !== 'undefined') {
            localStorage.removeItem("cart");
        }
    };

    // Lấy danh sách tỉnh/thành phố khi component mount
    useEffect(() => {
        if (mounted) {
            const getProvinces = async () => {
                try {
                    const provincesData = await fetchProvinces();
                    setProvinces(provincesData);
                } catch (error) {
                    console.error("Error fetching provinces:", error);
                }
            };
            getProvinces();
        }
    }, [mounted]);

    // Khi chọn tỉnh thành, load các quận/huyện tương ứng
    useEffect(() => {
        if (selectedProvince) {
            const getDistricts = async () => {
                try {
                    const districtsData = await fetchDistricts(selectedProvince);
                    setDistricts(districtsData);
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            };
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
            const getWards = async () => {
                try {
                    const wardsData = await fetchWards(selectedDistrict);
                    setWards(wardsData);
                } catch (error) {
                    console.error("Error fetching wards:", error);
                }
            };
            getWards();
        } else {
            setWards([]);
        }
        setSelectedWard("");
    }, [selectedDistrict]);

    if (!mounted) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-blue-900 text-center mb-8">
                Đơn hàng
            </h2>

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

                    {/* Địa chỉ */}
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
                                onChange={(e: { target: { value: string } }) => setSelectedProvince(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
                            >
                                <option value="">Chọn tỉnh/thành phố</option>
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
                                onChange={(e: { target: { value: string } }) => setSelectedDistrict(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
                                disabled={!selectedProvince}
                            >
                                <option value="">Chọn quận/huyện</option>
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
                                onChange={(e: { target: { value: string } }) => setSelectedWard(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none"
                                disabled={!selectedDistrict}
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((ward: Ward) => (
                                    <option key={ward.ward_id} value={ward.ward_id}>
                                        {ward.ward_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Địa chỉ chi tiết */}
                    <div className="relative">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ chi tiết <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={userInfo.address}
                            onChange={handleInputChange}
                            placeholder="Số nhà, tên đường..."
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Cột phải: Thông tin đơn hàng */}
                <div className="space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {orderItems.map((item: ProductOrder) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={item.image}
                                            alt={item.product_name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <span className="text-gray-700 text-sm">{item.product_name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-500 text-xs">
                                            {item.quantity} x {item.price.toLocaleString()} đ
                                        </div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            {(item.quantity * item.price).toLocaleString()} đ
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t text-lg font-bold">
                            <span>Tổng tiền:</span>
                            <span className="text-red-600">{totalAmount.toLocaleString()} đ</span>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
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
                                <span className="text-gray-700">Thanh toán khi nhận hàng (COD)</span>
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
                                <span className="text-gray-700">Thẻ tín dụng/ghi nợ</span>
                            </label>
                        </div>
                    </div>

                    {/* Nút đặt hàng */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
