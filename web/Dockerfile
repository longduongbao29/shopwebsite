# 1. Base image: dùng Node.js chính thức
FROM node:18-alpine AS deps

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json và lock file
COPY package.json package-lock.json* ./

# 4. Cài đặt dependencies
RUN npm ci

# 5. Copy toàn bộ mã nguồn
COPY . .

# 6. Build ứng dụng Next.js
RUN npm run build

# 7. Production image nhỏ gọn hơn
FROM node:18-alpine AS runner

# Tạo thư mục làm việc
WORKDIR /app

# Copy các file cần thiết từ stage build
COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Bật chế độ production
ENV NODE_ENV=production

# Mở port ứng dụng (nếu bạn chạy Next.js bằng `next start`)
EXPOSE 3000

# Start ứng dụng
CMD ["npm", "start"]
