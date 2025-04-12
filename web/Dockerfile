# 1. Base image
FROM node:18-alpine AS deps

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies (only if package.json changed)
COPY package.json package-lock.json* ./
RUN npm ci

# 4. Copy source code (sau khi npm ci xong để tránh cache lỗi)
COPY . .

# 5. Build Next.js
RUN npm run build

# 6. Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
