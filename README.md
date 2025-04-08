# MyShop Frontend

MyShop là dự án web bán hàng mẫu sử dụng **React**, **Vite**, **TypeScript** và **Tailwind CSS**.

## Tính năng

- **Header responsive** với hamburger menu, tên người dùng sau đăng nhập, và icon giỏ hàng.
- **Trang đăng nhập** sử dụng localStorage để lưu trạng thái người dùng.
- **Trang chủ và trang chi tiết sản phẩm** sử dụng dữ liệu test.
- Điều hướng bằng **React Router**.

## Tài khoản test

- **Username**: admin
- **Password**: admin

## Cài đặt

1. Clone repo và cài đặt dependencies:

   ```bash
   git clone <repository_url>
   cd <project_folder>
   npm install
   ```

2. Chạy server phát triển:

   ```bash
   npm run dev
   ```

   Truy cập: [http://localhost:5173](http://localhost:5173)

## Scripts

- `npm run dev` - chạy server phát triển
- `npm run build` - build bản production
- `npm run preview` - xem thử bản production

## Cấu trúc thư mục

```
src/
├── components/        # Header, UI components
├── data/              # Dữ liệu sản phẩm mẫu
├── layouts/           # Layout tổng
├── pages/             # Các trang chính
├── App.tsx            # Cấu hình router
└── main.tsx           # Entry point
```

## License

MIT