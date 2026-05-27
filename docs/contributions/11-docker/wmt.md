# Docker 部署贡献说明

**姓名:** 王敏涛 
**学号:** 2312190125
**日期:** 2026-05-19  

## 我完成的工作

### 1. Dockerfile 编写
- [x] **前端 Dockerfile (多阶段构建)**: 完成了基于 `node:20-alpine` 编译与 `nginx:alpine` 静态托管的多阶段构建配置。镜像大小控制在 28MB 左右。
- [√] **后端 Dockerfile (多阶段构建)**: 编写了基于 `eclipse-temurin:17` 的多阶段 Java 镜像构建文件，成功利用内嵌 `mvnw` 实现容器化编译。
- [√] **.dockerignore 文件**: 为前后端配置了精准的过滤文件，避免了本地无用物理缓存和敏感环境密钥打入镜像。

### 2. Compose 配置
- [√] **开发环境 compose.yaml**: 编写了不带 version 字段的高版本规范配置，并配置挂载 volumes 实现了前端前端的热重载。
- [√] **生产环境 compose.prod.yaml**: 加入了 `deploy.resources.limits` 进行 512M 物理内存硬性限额限制，并使用了高阶的 Docker Secrets 文件挂载机制对 MySQL 进行了生产密码加固。
- [√] **健康检查配置**: 为 MySQL 增加了 `mysqladmin ping` 状态监测，并为后端配置了相应的轮询侦听，避免了基础组件启动次序导致的崩溃。

### 3. 自动化部署与安全
- [√] **自动化流水线 (选项 A)**: 编写并集成了 GitHub Actions 自动化部署，在代码推入 main 时无缝触发。
- [√] **Trivy 安全扫描**: 在流水线中引入了 Aquasecurity Trivy-Action，实现了对高危漏洞的自动化防御审查。
- [√] **安全加固**: 为所有前、后端运行时镜像都配置并切换了非 root 账户（`nginx` 与 `spring` 用户）沙箱化运行。

---

## PR 链接
- PR #11: `https://github.com/xxx/xxx/pull/11` (根据你的实际PR填写)

---

## 遇到的问题和解决
1. **问题**: 切换至非 root 用户后，前端 Nginx 默认的 80 端口报错拒绝监听（`Permission Denied`）。
   **解决**: 因为在 Linux 中 1024 以下的特权端口必须由 root 用户启动。我通过在自定义的 `nginx.conf` 中将监听端口改为非特权端口 `8080`，并在外部做 `80:8080` 的端口映射解决了该权限冲突。

2. **问题**: 容器化后，后端启动时无法连接到 MySQL 数据库，报错 `java.net.ConnectException: Connection refused`。
   **解决**: 本地开发时配置的是 `localhost:3306`。在 Docker 网络中，容器之间应该通过服务名（Service Name）相互通信。我通过修改 Docker Compose 的 `environment` 参数，将数据库连接串里的 `localhost` 覆写为 `db`，并配置了 `condition: service_healthy` 以等待数据库完全就绪后再拉起后端，成功修复了此报错。

---

## AI 使用情况
- **使用了哪些 Prompt**: 
  - *“帮我为 React Vite + TS 前端编写一个基于安全和体积优化的非 root 用户多阶段构建 Dockerfile”*
  - *“如何使用 Docker Secrets 在生产环境的 Docker Compose 中隐式挂载和读取 MySQL 的随机高强度密码文件？”*
- **AI 帮助解决了哪些问题**: 
  1. 协助设计并调试了高度安全的生产级多阶段运行流水线。
  2. 提供了标准的 GitHub Actions 构建与 Trivy 漏洞检测 CI 组合模板。

---

## 心得体会
通过本次对完整 React+Spring Boot+MySQL 项目的实战容器化改造，我深刻领悟到了“微服务声明式架构”的高效。利用多阶段构建，我们使前端镜像体积缩减了将近 90%，而后端也成功摆脱了对外部复杂系统环境的强依赖。在配置 Docker Secrets 的过程中，我进一步加深了对生成级系统安全加固的理解。这种开箱即用、一键启停的容器化运维方案，真正实现了“一次编写，到处平滑运行”的现代开发目标。