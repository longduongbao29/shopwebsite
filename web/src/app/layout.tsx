import Header from "@/components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BotAssistant from "@/components/BotAssistant";
import "./globals.css";
import { ToastContainer } from "react-toastify";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuyMe Shop",
  description: "Shopping's so easy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Header />
        <ToastContainer
          position="top-center"       // Vị trí thông báo ở trên, căn giữa
          autoClose={3000}           // Tự động đóng sau 3 giây
          hideProgressBar={true}     // Ẩn thanh tiến trình
          newestOnTop={true}         // Thông báo mới nhất hiển thị trên cùng
          pauseOnHover={false}       // Không dừng thông báo khi hover chuột
        />
        {children}
        <BotAssistant />
      </body>
    </html>
  );
}
