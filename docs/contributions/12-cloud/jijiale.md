# 云服务部署贡献说明

姓名：纪嘉乐
学号：2312190109
角色：前端
日期：2026-06-02

## 我完成的工作

### 1. 平台选择
- **部署平台**: 阿里云 ECS（弹性云服务器）— 国内低延迟、新用户免费试用、支持 Docker Compose 一键部署
- **部署方式**: Docker Compose 统一编排——前端（Nginx）、后端（Spring Boot）、数据库（MySQL 8.0）三个服务整合在一个 compose 文件中
- **对比结论**: 相比 Vercel + Render 的拆分方案，阿里云 ECS + Docker Compose 更适合国内访问，且不需要跨平台配置 CORS 和外部数据库

### 2. 部署配置
- [✔] **compose.server.yaml**: 编写了服务器专用 Compose 文件，前端映射 80 端口、后端 8080 端口、MySQL 3306 端口，配置健康检查和自动重启
- [✔] **环境变量配置**: 通过 `.env` 文件管理 DB_ROOT_PASSWORD 和 AI_API_KEY，与代码分离，不提交到 Git
- [✔] **前后端 Dockerfile**: 前端多阶段构建（Node 构建 + Nginx 部署，非 root 用户运行）；后端 Maven 阿里云镜像加速 + Temurin JRE 运行
- [✔] **nginx.conf**: 非 root 用户运行，pid 写入 /tmp/，适配 Docker 容器环境

### 3. 部署文档
- [✔] **deployment.md**: 编写了完整的阿里云 ECS 部署说明，包含服务器选型、Docker 安装、部署步骤、安全组配置、健康验证和常见问题排查

---

## PR 链接
- PR #X: https://github.com/AASSKK99881/Help-1/pull/X (根据实际 PR 填写)

## 在线地址
- 前端: http://<ECS公网IP> (待部署后填写)
- 后端: http://<ECS公网IP>:8080/health (待部署后填写)

---

## 遇到的问题和解决
1. **问题**: 阿里云安全组默认不开放 80 和 8080 端口，部署后外网无法访问。
   **解决**: 在 ECS 控制台 → 安全组 → 入方向添加规则，放行 80/8080 端口（0.0.0.0/0）。

2. **问题**: 本地 compose.yaml 使用了 external 外部数据卷，服务器上不存在该卷导致启动失败。
   **解决**: 新建 compose.server.yaml，改用普通命名卷 `mysql_data`，由 Docker Compose 自动创建管理。

3. **问题**: 前端 Docker 容器内 nginx 以 root 运行，存在安全风险。
   **解决**: Dockerfile 中添加 `USER nginx`，nginx.conf 中 `pid /tmp/nginx.pid` 解决非 root 用户无法写 /var/run 的问题。

---

## AI 使用情况
- 使用了哪些 Prompt:
  - "Docker Compose 如何编排 Spring Boot + React + MySQL 三个服务"
  - "阿里云 ECS 部署 Docker Compose 项目的完整步骤"
  - "Nginx 非 root 用户运行 Docker 容器的最佳实践"
- AI 帮助解决了哪些问题:
  1. 提供了 compose.server.yaml 的完整配置（健康检查、网络、数据卷）
  2. 协助排查了安全组端口放行和 external 数据卷的问题
  3. 给出了 nginx.conf 非 root 运行的解决方案

---

## 心得体会
通过本次云服务部署实践，我掌握了 Docker Compose 在生产环境中的实际应用。相比将前后端拆分到不同平台（Vercel + Render），统一的 Docker Compose 方案更加简洁——一个 `docker compose up -d` 命令即可启动全部服务，无需跨平台配置 CORS 和外部数据库连接。

关键收获：环境变量与代码分离是部署安全的基础（`.env` 不提交 Git）；安全组配置是云服务器最容易忽略的环节；非 root 运行容器是一个容易被忽视但重要的安全实践。国内项目优先选择国内云平台，可以避免网络延迟和访问不稳定的问题。
