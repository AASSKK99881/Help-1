# === 阶段 1: 构建阶段 ===
FROM node:20-alpine AS builder
WORKDIR /app

# 分层缓存依赖
COPY package*.json ./
RUN npm ci && npm cache clean --force

# 复制源码并构建
COPY . .
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
RUN npx vite build

# === 阶段 2: 运行阶段（Nginx） ===
FROM nginx:1.27-alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 自定义 nginx 配置（含 SPA fallback + API 反向代理）
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/conf.d/default.conf \
    && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /tmp

# 非 root 运行
USER nginx

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/ || exit 1

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
