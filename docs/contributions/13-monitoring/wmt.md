"""# 云服务部署贡献说明
姓名: 王敏涛
学号: 2312190125
日期: 2026-06-02

## 我完成的工作
### 1. 平台选择
- 使用平台: Vercel (前端) / Railway (后端)

### 2. 部署配置
- [x] 配置文件编写 (编写了 `vercel.json` 及后端的 Docker 部署配置)
- [x] 环境变量配置 (在 Vercel 注入 `NODE_ENV` 和后端 API 环境变量，在服务器配置了 `DATABASE_URL`)
- [x] 自动部署配置 (通过 Git 关联 Vercel 实现主分支推送自动部署)

### 3. 问题解决
- 遇到的问题: 在服务器上进行容器部署时，前后端跨域请求失败以及 Maven 编译时报错“No compiler provided”。
- 解决方案: 在后端的 Spring Boot 配置中补全了完整的跨域映射规则；同时调整了 Dockerfile 中的基础镜像和 Maven 环境变量，确保编译通过并顺利在服务器上运行。

## PR链接


## 在线地址
前端: https://help-1.vercel.app (待部署)
后端: https://help-1-api.railway.app (待部署)

## 心得体会

- 编写项目基础部署指南 `docs/deployment.md`，规范前后端分离的上线流程。
- 配置 Vercel 的前端自动化构建与重写规则 (`vercel.json`)，解决单页应用路由 404 问题。
- 在云平台成功配置前端所需的生产级环境变量。