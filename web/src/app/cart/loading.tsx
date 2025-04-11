export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100">
            <div className="flex flex-col items-center space-y-6">
                {/* Logo animation */}
                <div className="text-4xl font-bold text-blue-600 animate-bounce tracking-wide">
                    <img src="/favicon.ico" alt="BuyMe icon" className="w-16 h-16" />
                </div>

                {/* Spinner dưới logo */}
                <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

                <p className="text-sm text-gray-600 animate-pulse mt-4">Đang tải nội dung...</p>
            </div>
        </div>
    );
}
