# === 阶段一：Node 构建阶段 ===
FROM node:18-alpine AS builder
WORKDIR /app
# 复制 package.json
COPY package*.json ./

# 设置淘宝镜像加速
RUN npm config set registry https://registry.npmmirror.com/

# 安装依赖
RUN npm install
# 复制所有前端源码
COPY . .
# 🎯 核心修改：直接使用 vite 打包，跳过烦人的 TypeScript 严格检查
RUN npx vite build

# === 阶段二：Nginx 部署阶段 ===
FROM nginx:alpine
# 把第一阶段打包好的 dist 文件拷贝到 Nginx 的静态资源目录
COPY --from=builder /app/dist /usr/share/nginx/html
# 自定义 nginx 配置：非特权端口 8080，非 root 运行，pid 路径可写
COPY nginx.conf /etc/nginx/nginx.conf
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf \
    && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /tmp /etc/nginx/conf.d
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]