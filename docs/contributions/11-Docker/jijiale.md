# Docker 部署贡献说明
姓名: XXX
学号: XXX
日期: 2026-05-19

## 我完成的工作
### 1. Dockerfile 编写
- [✔] 前端 Dockerfile (多阶段构建)
- [ ] 后端 Dockerfile(多阶段构建)
- [✔] .dockerignore 文件

### 2. Compose 配置
- [✔] 开发环境 compose.yaml
- [✔] 生产环境 compose.prod.yaml
- [ ] 健康检查配置

### 3.自动化部署
- 选择了选项A/B: （由后端同学负责）

## PR链接
- PR #X: https://github.com/xxx/xxx/pull/X

## 遇到的问题和解决
1. 问题: 前端打包后需要使用 Nginx 运行静态文件，但作业要求“非 root 用户运行”，而常规 Nginx 镜像默认需要 root 权限来绑定 80 端口，导致启动失败。
   解决: 改用官方的 `nginxinc/nginx-unprivileged:alpine` 非特权镜像，并将 EXPOSE 暴露端口调整为 8080，既满足了安全要求，又成功跑通了服务。
2. 问题: 首次构建镜像时发现耗时极长，且上下文传输非常大。
   解决: 发现是把本地的依赖库也带入了容器。通过编写前端专属的 `.dockerignore` 文件，排除了 `node_modules`、`.git`、`.env` 等无关目录，大大提升了构建效率并缩减了镜像体积。

## AI 使用情况
- 使用了哪些 Prompt: “我使用的是 React + Vite 技术栈，请帮我创建一个前端生产级的多阶段构建 Dockerfile，要求基础镜像使用 alpine 或 slim，非 root 用户运行，包含健康检查，并提供对应的 .dockerignore 文件。”
- AI 帮助解决了哪些问题: AI 帮助我理清了多阶段构建（Node 编译阶段与 Nginx 运行阶段分离）的思路，提供了非特权 Nginx 镜像的解决方案，并给出了规范的 `HEALTHCHECK` 健康检查指令。

## 心得体会
在这次容器化部署的前端工作部分，我深刻体会到了 Docker 多阶段构建的优势。通过分离构建环境和运行环境，最终生成的镜像不包含任何前端源码和庞大的 Node 依赖包，极大地优化了镜像体积（控制在 50MB 以内）。同时，配置非 root 权限让我意识到了生产环境中容器安全配置的必要性。这也让我为后端同学后续的 Compose 服务编排提供了轻量、安全、标准的独立前端容器。