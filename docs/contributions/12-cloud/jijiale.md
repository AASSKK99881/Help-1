# 云服务部署贡献说明

姓名：纪嘉乐
学号：2312190109
角色：前端
日期：2026-06-02

## 我完成的工作

### 1. 平台选择
- **前端**: Vercel — 免费、自动部署、全球 CDN、适合 Vite React SPA
- **后端**: Railway — 支持 Docker 部署、自动检测 Dockerfile
- **数据库**: Railway MySQL 插件 / PlanetScale

### 2. 部署配置
- [✔] **vercel.json**: 配置了 Vite 构建命令、SPA 路由重写、静态资源长期缓存
- [✔] **环境变量配置**: 梳理了前后端所需的环境变量清单（VITE_API_URL、数据库连接、AI API Key）
- [✔] **自动部署**: 前端连接 GitHub → Vercel 自动构建；后端连接 GitHub → Railway 自动检测 Dockerfile → 构建部署

### 3. 部署文档
- [✔] **deployment.md**: 编写了完整的云服务部署说明，包含平台对比、部署步骤、环境变量清单和架构图示

---

## PR 链接
- PR #X: https://github.com/AASSKK99881/Help-1/pull/X (根据实际 PR 填写)

## 在线地址
- 前端: https://help-1.vercel.app (待部署)
- 后端: https://help-1-api.railway.app (待部署)

---

## 遇到的问题和解决
1. **问题**: Vite SPA 在 Vercel 上刷新子路由（如 /tasks）会 404。
   **解决**: 在 `vercel.json` 中配置 `rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]`，将所有路由重写到入口 HTML，由前端路由接管。

2. **问题**: Vercel 默认根目录是仓库根目录，但前端代码在 `frontend/` 子目录下。
   **解决**: 在 `vercel.json` 中将 buildCommand 设为 `cd frontend && npm install && npm run build`，outputDirectory 设为 `frontend/dist`。

---

## AI 使用情况
- 使用了哪些 Prompt:
  - "Vite React SPA 如何在 Vercel 上配置 SPA 路由重写"
  - "前后端分离项目如何选择合适的云部署平台"
- AI 帮助解决了哪些问题:
  1. 提供了 Vercel SPA rewrites 配置方案
  2. 对比了 Vercel/Railway/Render 等免费平台的适用场景

---

## 心得体会
通过本次云服务部署实践，我了解了前后端分离项目的常见部署架构。Vercel 对前端 SPA 的支持非常友好，自动 HTTPS 和全球 CDN 开箱即用；Railway 通过自动检测 Dockerfile 使得后端部署几乎零配置。合理的环境变量管理是实现"Build once, deploy anywhere"的关键——代码与配置分离，同一份镜像可以在开发/生产环境复用。
