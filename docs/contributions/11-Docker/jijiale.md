# Docker 部署贡献说明

姓名：纪嘉乐
学号：2312190109
角色：前端
日期：2026-05-19

## 我完成的工作

### 1. Dockerfile 编写
- [✔] **前端 Dockerfile（多阶段构建）**: 完善了前端的 `node:18-alpine` 编译 + `nginx:alpine` 部署的多阶段构建。修复了 nginx 阶段缺少非 root 用户运行的问题——通过将监听端口改为 8080 并切换至 `nginx` 用户，实现沙箱化运行。
- [x] **后端 Dockerfile**: 审查并确认后端 `eclipse-temurin:17` 多阶段构建已正确配置非 root `spring` 用户。
- [✔] **.dockerignore 文件**: 审查前后端 .dockerignore，确认排除了 node_modules、.git、.env 等无关和敏感文件。

### 2. Compose 配置
- [✔] **开发环境 compose.yaml**: 在项目根目录编写了完整的开发环境编排配置，包含前端(5173:8080)、后端(8080:8080)、MySQL(3306:3306)三个服务，配置了健康检查依赖和热重载。
- [✔] **生产环境 compose.prod.yaml**: 编写了生产级编排配置，使用 GHCR 镜像拉取 + Docker Secrets 密钥管理 + 资源限制(frontend 128M, backend 512M) + restart: unless-stopped。
- [✔] **健康检查配置**: 为后端添加了 `/health` 端点的 wget 轮询检查，为 MySQL 保留了 mysqladmin ping。

### 3. 自动化部署
- [✔] **GitHub Actions (选项 A)**: 编写了 `.github/workflows/docker.yml`，在 push main 时自动构建前后端镜像并推送至 GHCR，集成 Trivy 安全扫描（CRITICAL,HIGH 级别）。
- [✔] **deploy.sh**: 编写了一键生产部署脚本，支持 `docker compose -f compose.prod.yaml up -d --build`。
- [✔] **.env.example**: 创建了环境变量模板文件，包含 DB_ROOT_PASSWORD 和 AI_API_KEY。

---

## PR 链接
- PR #X: https://github.com/AASSKK99881/Help-1/pull/12 

---

## 遇到的问题和解决
1. **问题**: 前端 Nginx 镜像在切换 `USER nginx` 后无法绑定 80 端口（Permission Denied）。
   **解决**: 1024 以下为特权端口，需 root 权限。通过在 Dockerfile 中将 default.conf 的监听端口改为 8080，并在 compose 中做外部端口映射（5173:8080 / 80:8080）解决。

2. **问题**: 生产环境数据库密码不应硬编码在 compose 文件中。
   **解决**: 在 compose.prod.yaml 中使用 Docker Secrets 机制，通过 `/run/secrets/db_password` 文件挂载方式注入密码，配合 `MYSQL_ROOT_PASSWORD_FILE` 环境变量。

---

## AI 使用情况
- **使用了哪些 Prompt**:
  - "为 React + Vite + TypeScript 前端编写生产级多阶段 Dockerfile，要求 nginx:alpine 非 root 运行"
  - "如何配置 Docker Compose 生产环境的 secrets 管理和 GHCR 镜像拉取"
- **AI 帮助解决了哪些问题**:
  1. 协助解决了 nginx 非 root 用户的端口权限问题
  2. 提供了 GitHub Actions + Trivy 安全扫描的 CI 模板

---

## 心得体会
通过本次 Docker 容器化部署实践，我掌握了前端项目的多阶段构建流程，理解了非 root 运行的安全意义。在配置 Docker Compose 编排时，深入理解了服务依赖（depends_on + condition: service_healthy）的重要性。编写 GitHub Actions 工作流让我体会到 CI/CD 自动化对团队效率的提升——代码推送即可自动构建、扫描、推送镜像，真正实现了"Build once, run anywhere"。
