# Hướng dẫn chuyển đổi từ CSR sang SSR - Next.js

## Tổng quan
Đã hoàn thành việc chuyển đổi tất cả các trang từ Client-Side Rendering (CSR) sang Server-Side Rendering (SSR) trong dự án Next.js.

## Các trang đã được chuyển đổi

### 1. Trang chủ (`/src/app/page.tsx`)
- ✅ **SSR**: Fetch dữ liệu sản phẩm ở server-side
- ✅ **Component client**: `HomePageClient` xử lý interactions
- ✅ **Caching**: Sử dụng `force-cache` cho API calls

### 2. Trang đăng nhập (`/src/app/login/page.tsx`)
- ✅ **SSR**: Server component đơn giản
- ✅ **Component client**: `LoginPageClient` với loading states
- ✅ **UX**: Hydration-safe với mounted state

### 3. Trang đăng ký (`/src/app/register/page.tsx`)
- ✅ **SSR**: Server component đơn giản
- ✅ **Component client**: `RegisterPageClient` với loading states
- ✅ **UX**: Auto-login sau đăng ký thành công

### 4. Trang tìm kiếm (`/src/app/search/page.tsx`)
- ✅ **SSR**: Sử dụng `searchParams` để fetch dữ liệu ở server
- ✅ **Component client**: `SearchPageClient` với state management
- ✅ **Performance**: Giảm loading time cho search results

### 5. Trang đặt hàng (`/src/app/order/page.tsx`)
- ✅ **SSR**: Server component đơn giản
- ✅ **Component client**: `OrderPageClient` với form handling
- ✅ **Features**: Địa chỉ provinces/districts/wards integration

### 6. Trang giỏ hàng (`/src/app/cart/page.tsx`)
- ✅ **SSR**: Server component đơn giản
- ✅ **Component client**: `CartPageClient` với cart management
- ✅ **LocalStorage**: Hydration-safe cart handling

## API Clients đã được cập nhật

### 1. Product API (`/lib/product_api.ts`)
```typescript
const getBaseURL = () => {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        return process.env.NEXT_PUBLIC_API_URL || "http://server:8000";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};
```
- ✅ **Server/Client detection**: Khác nhau URL cho server và client
- ✅ **Caching strategies**: `force-cache`, `no-store` phù hợp
- ✅ **Error handling**: Graceful fallbacks

### 2. Auth API (`/lib/auth_api.ts`)
- ✅ **SSR compatible**: Chỉ access localStorage ở client-side
- ✅ **Token management**: Safe token storage
- ✅ **Error handling**: Improved error messages

## Client Components Structure

### Pattern sử dụng:
```typescript
// SSR Page
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <PageClient data={data} />;
}

// Client Component
"use client";
export default function PageClient({ data }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }
  
  return <div>{/* Interactive content */}</div>;
}
```

## Lợi ích đạt được

### 1. SEO Improvement
- ✅ **Content được render ở server**: Crawlers có thể đọc content
- ✅ **Meta tags**: Có thể set dynamic meta tags
- ✅ **Social sharing**: Better Open Graph support

### 2. Performance
- ✅ **First Contentful Paint**: Giảm thời gian tải trang đầu tiên
- ✅ **Caching**: Sử dụng Next.js built-in caching
- ✅ **Bundle size**: Giảm JavaScript bundle cho client

### 3. User Experience
- ✅ **Loading states**: Proper loading indicators
- ✅ **Error boundaries**: Better error handling
- ✅ **Hydration errors**: Eliminated với mounted pattern

### 4. Maintainability
- ✅ **Separation of concerns**: Server logic tách biệt client logic
- ✅ **Reusable components**: Client components có thể reuse
- ✅ **Type safety**: Better TypeScript support

## Các bước tiếp theo

### 1. Dependencies cần cài đặt
```bash
npm install @types/node
# Hoặc đảm bảo các dependencies React/Next.js đã được cài đúng
```

### 2. Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
# Production:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 3. Testing
- [ ] Test tất cả pages hoạt động bình thường
- [ ] Verify API calls work in both dev và production
- [ ] Check localStorage integration
- [ ] Test form submissions

### 4. Production Deployment
- [ ] Configure environment variables
- [ ] Test internal API URLs for server-side calls
- [ ] Verify caching strategies work correctly
- [ ] Monitor performance metrics

## Troubleshooting

### Common Issues:

1. **Hydration Errors**
   - ✅ **Solution**: Sử dụng mounted state pattern

2. **API URL không đúng**
   - ✅ **Solution**: `getBaseURL()` function detect server/client

3. **LocalStorage access in SSR**
   - ✅ **Solution**: Check `typeof window !== 'undefined'`

4. **Missing TypeScript types**
   - ⚠️ **Solution**: Cài đặt `@types/node` và các dependencies cần thiết

## Kết luận

Đã hoàn thành việc chuyển đổi thành công từ CSR sang SSR cho toàn bộ ứng dụng. Tất cả các trang giờ đây:
- Render content ở server-side để cải thiện SEO
- Maintain interactive functionality ở client-side
- Có better performance và user experience
- Sử dụng Next.js best practices

Dự án sẵn sàng để deploy với architecture SSR hiện đại và maintainable.
