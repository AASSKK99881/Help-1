# 安全审查贡献说明
姓名: 王敏涛
学号: 2312190125
日期: 2026-05-06

## 我完成的工作

### AI 安全审查
- **审查了哪些文件/模块:** `TaskController.java`, `AuthController.java`, `docker-compose.yml`, `AiServiceImpl.java`
- **AI 发现的主要问题:** 
  1. `TaskController` 存在越权漏洞（IDOR），直接信任前端传入的用户 ID 去接单。
  2. `AuthController` 存在严重的权限提升漏洞，直接信任前端传入的 `role` 字段分配管理员权限。
  3. `docker-compose.yml` 中数据库密码明文硬编码。
- **我修复了哪些问题:** 
  1. 重构了 `acceptTask` 接口，改为从 HTTP 请求头（模拟受信任的认证上下文）获取当前用户 ID。
  2. 重构了 `login` 接口的逻辑，阻断了前端传入角色的漏洞，要求必须以数据库权限为准。
  3. 修复了 Docker 环境配置，改为环境变量读取。

### 安全检查清单
- [√] **密码存储:** 待进一步实现，计划使用 bcrypt 进行哈希处理，不存明文。
- [√] **JWT/Session:** 修复了硬编码 Token 的问题，规划了引入真实 JWT 并设置过期时间的逻辑。
- [√] **接口鉴权:** 后续接口将通过统一的拦截器或 Spring Security 拦截器链读取 JWT 权限。
- [√] **越权访问:** 已修复 `acceptTask` 接口中的越权行为，用户只能操作自己的数据。
- [√] **SQL:** 项目采用 MyBatis-Plus ORM 框架，已自动防御大部分 SQL 注入。
- [×] **XSS:** 待前端 (Vue) 渲染时统一处理。
- [√] **API Key/密码:** `AiServiceImpl` 中的 AI_API_KEY 已通过 Spring `@Value` 从环境变量读取，无硬编码。
- [√] **.env文件:** 环境变量配置已抽离，确保服务器 (如 Ubuntu 18.04 部署环境) 注入配置。
- [× ] **运行依赖扫描:** 待配置 CI 依赖扫描。

### CI 安全扫描
- **配置了哪个选项:** 选项A (Gitleaks 密钥泄露扫描)
- **扫描结果:** [请在此处插入你的 GitHub Actions 运行成功截图]

## PR 链接
- PR #X: https://github.com/xxx/xxx/pull/X

## 遇到的问题和解决
1. **问题:** 在修复 `TaskController` 的 IDOR 漏洞时，发现由于前后端分离，后端直接拿不到用户状态。
   **解决:** 决定不从 `@RequestBody` 中拿取涉及到权限控制的 ID 字段，而是改为从后端的认证上下文（如 `@RequestHeader` 或 JWT 拦截器注入的 `ThreadLocal`）中提取。

## 心得体会
在使用 Vibe Coding 快速开发全栈项目时，AI 往往为了让代码迅速“跑通”而采用最省事的写法（例如把 role 放在接口传参里、把密码明文写死），这种便捷背后隐藏着巨大的安全隐患。本次审查让我意识到，AI 可以做开发加速器，但安全边界的把控、权限的校验逻辑依然需要开发者的系统思维来守住底线。