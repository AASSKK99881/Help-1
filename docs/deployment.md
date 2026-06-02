# 云服务部署说明

## 概述

Help-1 校园积分互助平台采用前后端分离架构，推荐将前端部署至 Vercel，后端部署至 Railway/Render，数据库使用云 MySQL。

## 部署架构

```
用户浏览器
    │
    ├── 前端 (Vercel) ─── https://help-1.vercel.app
    │       │
    │       └── API 请求代理至后端
    │
    ├── 后端 (Railway) ─── https://help-1-api.railway.app
    │       │
    │       └── MySQL 数据库
    │
    └── 数据库 (Railway MySQL / PlanetScale)
```

## 一、前端部署 (Vercel)

### 平台特点
- 免费套餐：100GB 带宽/月，自动 HTTPS
- 自动部署：连接 GitHub 仓库，push 自动构建
- 全球 CDN 加速

### 部署步骤

1. 访问 [vercel.com](https://vercel.com) 注册/登录
2. 点击 "New Project" → 导入 GitHub 仓库 `AASSKK99881/Help-1`
3. 配置构建设置:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. 添加环境变量:
   - `VITE_API_URL` = `https://help-1-api.railway.app`
5. 点击 Deploy

### 配置文件 (vercel.json)

已配置 SPA 路由重写（所有路径 → index.html）和静态资源缓存。

## 二、后端部署 (Railway)

### 平台特点
- 支持 Docker 部署
- 免费额度：$5/月，500 小时运行
- 自动部署：GitHub 连接

### 部署步骤

1. 访问 [railway.app](https://railway.app) 注册/登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择仓库，Railway 自动检测 Dockerfile
4. 配置环境变量:
   - `SPRING_DATASOURCE_URL` = `jdbc:mysql://<db-host>:3306/help_db?...`
   - `SPRING_DATASOURCE_USERNAME` = `root`
   - `SPRING_DATASOURCE_PASSWORD` = `<数据库密码>`
   - `AI_API_KEY` = `<AI API 密钥>`
5. 配置健康检查路径: `/health`
6. 部署

### 替代方案: Render

访问 [render.com](https://render.com)，选择 "Web Service" → 连接 GitHub → 自动检测 Dockerfile。

## 三、数据库

### 选项 A: Railway MySQL 插件
- Railway 内置 MySQL 插件，一键创建
- 自动注入 `DATABASE_URL` 环境变量

### 选项 B: PlanetScale (MySQL 兼容)
- 免费 1 亿行读取/月
- 支持 GitHub 登录，自带分支管理
- 连接串示例: `mysql://<user>:<password>@<host>/help_db?ssl={"rejectUnauthorized":true}`

### 选项 C: Supabase (PostgreSQL)
- 免费 500MB 数据库
- 需适配 PostgreSQL（Spring Boot 更换驱动）

## 四、环境变量清单

| 变量名 | 用途 | 前端 | 后端 |
|--------|------|------|------|
| VITE_API_URL | 后端 API 地址 | ✓ | - |
| SPRING_DATASOURCE_URL | 数据库连接串 | - | ✓ |
| SPRING_DATASOURCE_USERNAME | 数据库用户名 | - | ✓ |
| SPRING_DATASOURCE_PASSWORD | 数据库密码 | - | ✓ |
| AI_API_KEY | AI 服务密钥 | - | ✓ |

## 五、自动部署流程

```
Git Push → GitHub
    │
    ├── Vercel 检测 frontend/ 变更 → npm run build → 部署静态文件
    │
    └── Railway 检测 backend/ 变更 → docker build → 部署容器
```

## 六、目录结构

```
Help-1/
├── vercel.json              # Vercel 部署配置
├── frontend/
│   └── Dockerfile           # 前端容器化（Railway/Render 使用）
├── backend/help/
│   └── Dockerfile           # 后端容器化
└── docs/
    └── deployment.md        # 本文档
```
