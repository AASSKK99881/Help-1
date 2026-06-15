#!/bin/bash
set -e

COMPOSE_FILE=${1:-compose.server.yaml}

echo "🚀 开始部署 (${COMPOSE_FILE})..."

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，请先创建 .env 文件（参考 .env.example）"
    exit 1
fi

# 拉取最新镜像（如使用 GHCR）
if echo "$COMPOSE_FILE" | grep -q "prod"; then
    echo "📦 拉取最新镜像..."
    docker compose -f "$COMPOSE_FILE" pull || true
fi

# 重新构建并启动
echo "🔨 构建并启动服务..."
docker compose -f "$COMPOSE_FILE" up -d --build

# 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 10

# 显示服务状态
docker compose -f "$COMPOSE_FILE" ps

# 健康检查
echo ""
echo "🏥 健康检查..."
if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
    echo "  ✅ 后端健康检查通过"
else
    echo "  ⚠️  后端尚未就绪，请稍后再试"
fi

echo ""
echo "✅ 部署完成"
echo "📍 前端: http://localhost"
echo "📍 后端: http://localhost:8080/health"
