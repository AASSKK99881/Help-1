# 云服务部署说明

## 概述

Help-1 校园积分互助平台采用 Docker Compose 统一编排方案，部署至阿里云 ECS 云服务器。前端（Nginx）、后端（Spring Boot）、数据库（MySQL 8.0）三个服务通过一个 compose 文件一键启动。

## 部署架构

```
用户浏览器
    │
    ├── http://<公网IP>:80 ─── 前端 (Nginx / React SPA)
    │
    └── http://<公网IP>:8080 ─── 后端 (Spring Boot)
                │
                └── MySQL 8.0 (容器内网通信，不暴露外网)
```

## 一、服务器准备

### 平台选择
- **阿里云 ECS**: 新用户免费试用 1 个月，1 核 2G 即可
- **系统镜像**: Ubuntu 22.04 或 CentOS 7.9
- **必须分配公网 IPv4 地址**

### 安全组配置（重要！）

ECS 控制台 → 安全组 → 入方向添加规则：

| 端口 | 协议 | 授权对象 | 说明 |
|------|------|----------|------|
| 22 | TCP | 0.0.0.0/0 | SSH 远程登录 |
| 80 | TCP | 0.0.0.0/0 | 前端页面 |
| 8080 | TCP | 0.0.0.0/0 | 后端 API |

> 注意：MySQL 的 3306 端口**不要**对外放开，仅在 Docker 内网通信。

## 二、部署步骤

### 1. 连接服务器

```bash
ssh root@<公网IP>
```

### 2. 安装 Docker

```bash
curl -fsSL https://get.docker.com | bash
systemctl enable docker && systemctl start docker
```

### 3. 克隆仓库

```bash
git clone https://github.com/AASSKK99881/Help-1.git
cd Help-1
```

### 4. 创建环境变量文件

```bash
cat > .env << 'EOF'
DB_ROOT_PASSWORD=<你的数据库密码>
AI_API_KEY=<你的AI密钥>
EOF
```

### 5. 修改前端 API 地址

编辑 `compose.server.yaml`，将 `<服务器公网IP>` 替换为实际的 ECS 公网 IP：

```bash
sed -i 's|<服务器公网IP>|你的实际IP|g' compose.server.yaml
```

### 6. 启动全部服务

```bash
docker compose -f compose.server.yaml up -d --build
```

首次构建需要下载依赖，约 5-10 分钟。

### 7. 验证部署

```bash
# 查看容器状态（三个都显示 healthy）
docker compose -f compose.server.yaml ps

# 测试健康检查
curl http://localhost:8080/health

# 测试指标端点
curl http://localhost:8080/metrics
```

### 8. 浏览器访问

```
前端页面: http://<公网IP>
后端健康: http://<公网IP>:8080/health
后端指标: http://<公网IP>:8080/metrics
```

## 三、服务端口说明

| 服务 | 容器内端口 | 宿主机端口 | 说明 |
|------|-----------|-----------|------|
| frontend | 8080 | 80 | Nginx 监听容器内 8080，映射到宿主机 80 |
| backend | 8080 | 8080 | Spring Boot 直接映射 |
| db | 3306 | 3306 | MySQL，建议仅内网访问 |

## 四、环境变量清单

| 变量名 | 用途 | 必填 | 配置位置 |
|--------|------|------|----------|
| DB_ROOT_PASSWORD | MySQL root 密码 | 是 | .env 文件 |
| AI_API_KEY | DeepSeek AI 密钥 | 是 | .env 文件 |
| VITE_API_URL | 前端请求后端地址 | 是 | compose.server.yaml 中硬编码 |

## 五、目录结构

```
Help-1/
├── compose.server.yaml      # 服务器部署 Compose 文件
├── deploy.sh                # 一键部署脚本
├── .env                     # 环境变量（不提交 Git）
├── frontend/
│   ├── Dockerfile           # 前端多阶段构建
│   ├── nginx.conf           # Nginx 非 root 配置
│   └── src/app/api/client.ts
├── backend/help/
│   ├── Dockerfile           # 后端 Maven 构建 + JRE 运行
│   ├── settings.xml         # Maven 阿里云镜像
│   └── src/main/resources/
│       ├── application.properties
│       └── logback-spring.xml
└── docs/
    └── deployment.md        # 本文档
```

## 六、常见问题

### Q1: 外网无法访问
检查阿里云安全组是否放行了 80 和 8080 端口。

### Q2: 后端启动失败
可能是数据库健康检查超时，MySQL 首次初始化较慢，等待 30 秒后重试：
```bash
docker compose -f compose.server.yaml restart backend
```

### Q3: 前端页面空白
检查 `VITE_API_URL` 是否配置了正确的服务器 IP，以及后端是否正常运行。

### Q4: 磁盘空间不足
ECS 免费试用默认系统盘 20GB，Docker 镜像和日志可能占满：
```bash
docker system prune -a  # 清理无用镜像和容器
```
