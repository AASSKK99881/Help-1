# 云服务部署贡献说明

姓名: 王敏涛
学号: 2312190125
日期: 2026-06-03

## 我完成的工作
### 1. 平台选型调研
- 初期调研了 Vercel (前端) / Railway (后端) 方案，编写了 `vercel.json` 配置测试前端构建
- 最终团队确定采用阿里云 ECS + Docker Compose 统一部署方案

### 2. 部署配置
- [✔] 参与编写 `vercel.json` 前端部署配置文件（初始方案，未用于生产）
- [✔] 后端环境变量配置：在服务器端配置了数据库连接、AI_API_KEY 等环境变量
- [×] compose.server.yaml（由前端同学编写）

### 3. 问题协助
- 遇到的问题: 初期 Vercel + Railway 方案前后端跨域请求失败；服务器上 Maven 编译时报错"No compiler provided"
- 协助排查与解决: 在后端 Spring Boot 配置中补全了跨域映射规则，协助调整了 Dockerfile 中的基础镜像和 Maven 环境变量

## PR链接


## 实际部署地址
- 前端: http://121.199.22.22
- 后端 API: http://121.199.22.22:8080
- 备注：初期计划的 Vercel (help-1.vercel.app) 和 Railway (help-1-api.railway.app) 方案未实际部署上线，最终采用阿里云 ECS 方案。

## 心得体会
- 参与调研了前后端分离的多平台部署方案（Vercel + Railway），了解了 Serverless 部署的优势和限制
- 在实际部署过程中协助排查了跨域和 Maven 编译问题，加深了对全栈部署的理解
- 体会到了统一 Docker Compose 方案相比拆分到多个平台的简化优势
