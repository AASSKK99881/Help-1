# Help-1 校园学生积分互助平台

[![CI](https://github.com/AASSKK99881/Help-1/actions/workflows/ci.yml/badge.svg)](https://github.com/AASSKK99881/Help-1/actions)
[![Backend Coverage](https://codecov.io/gh/AASSKK99881/Help-1/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/AASSKK99881/Help-1)
[![Frontend Coverage](https://codecov.io/gh/AASSKK99881/Help-1/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/AASSKK99881/Help-1)
[![Security Scan](https://github.com/AASSKK99881/Help-1/actions/workflows/security.yml/badge.svg)](https://github.com/AASSKK99881/Help-1/actions)

> **面向校园场景的学生积分互助与任务委托平台**

Help-1 是一个以积分为核心激励媒介的校园互助平台，学生可以发布互助任务（取快递、课程辅导、设备维修等）悬赏积分，其他学生接单完成后获得积分奖励。平台配备教师管理端，负责内容审核、用户管理和积分调控。系统集成了 DeepSeek AI 大模型，在任务发布时自动进行 AI 内容审核，智能识别违规内容并给出通过/驳回判断。

***

## 团队成员与分工

| 姓名 | 学号 | 核心职责 |
|------|------|----------|
| **纪嘉乐** | 2312190109 | **前端负责人**：React 18 + TypeScript 前端架构与页面开发、UI/UX 原型设计（学生端）、前端测试体系（111 个用例 / 83.47% 覆盖率）、Docker 容器化与阿里云 ECS 部署、CI/CD 与监控配置 |
| **王敏涛** | 2312190125 | **后端负责人**：Spring Boot 3.2 后端架构与 API 开发、MySQL 数据库设计与 ORM 建模、JWT 认证与安全审查（漏洞修复）、AI 后端集成（DeepSeek API 封装）、Docker 镜像与 Compose 编排 |

**设计稿 (Figma)**: [查看原型设计](https://www.figma.com/make/Puw2eMAeHURzJZrExXMKm6/%E6%A0%A1%E5%9B%AD%E5%AD%A6%E7%94%9F%E7%A7%AF%E5%88%86%E4%BA%92%E5%8A%A9%E7%BD%91%E7%AB%99?t=Mk6yX0mycd0VyjCG-1&preview-route=%2Flogin)

**线上地址**：http://121.199.22.22

***

## 核心功能模块

### 1. 学生端 — 任务委托与积分互动

- **任务大厅**：首页展示可接取的互助任务列表，支持分类筛选（跑腿/辅导/维修等）、关键词搜索、骨架屏加载与公告轮播。
- **任务全生命周期管理**：发布任务（标准化表单 + AI 辅助填写）→ 接单 → 执行 → 确认完成 → 积分自动划转，支持匿名发布、中途取消（违约扣分）、放弃接单等完整流程。
- **积分事务体系**：悬赏积分发布时预冻结、完成后划转、取消时按比例违约扣除，所有积分变动均产生流水记录（points_logs），保证强一致性与可追溯性。

> **[需要截图：学生端首页任务大厅页面]**

### 2. 管理端 — 内容审核与运营管理

- **数据看板**：平台总用户数、活跃用户、累计委托量、待审核数等核心指标可视化展示。
- **内容审核工作流**：任务按待审核/已通过/已驳回分类管理，支持单条/批量审核操作，驳回需填写原因并同步通知发布用户。
- **用户与积分管理**：多维度用户筛选、积分发放/扣除（需填写原因）、账号封禁/解封、活动发布与管理。

> **[需要截图：管理端数据看板页面]**

### 3. AI 智能辅助

- **AI 自动审核委托内容**：学生发布任务时，系统自动调用 DeepSeek-V3 大模型对任务标题和描述进行内容审核。AI 结合数据库敏感词库和审核标准（禁止违法、作弊、代考等内容），返回 PASS（通过并自动上架）或 REJECT（驳回并写明原因），实现发布即审核的自动化流程。
- **AI 辅助开发**：全程使用 Claude Code 辅助代码生成、安全审查、测试编写与文档撰写，形成 "AI 生成 + 人工审查修改" 的高效工作流。

> **[需要截图：AI 审核结果展示（审核通过/审核驳回的前端提示效果）]**

***

## 技术架构

### 前端 (Frontend)

- **核心框架**：React 18 + TypeScript（Hooks + 强类型）
- **构建工具**：Vite
- **CSS 方案**：Tailwind CSS 4 + PostCSS
- **UI 组件库**：shadcn/ui (Radix UI)
- **路由与状态**：React Router + AuthContext
- **安全防护**：DOMPurify（AI 输出 XSS 净化）
- **测试框架**：Vitest + @testing-library/react + user-event

### 后端 (Backend)

- **核心框架**：Spring Boot 3.2 (Java 17)
- **ORM**：MyBatis-Plus
- **数据库**：MySQL 8.0（InnoDB + utf8mb4）
- **认证**：JWT (jjwt) + BCrypt (jbcrypt)
- **AI 引擎**：DeepSeek-V3 (deepseek-chat) + OpenAI 协议
- **日志监控**：Logback + LogstashEncoder（JSON 结构化日志）+ /health + /metrics 端点

### 部署与运维

- **容器化**：Docker 多阶段构建（前后端均非 root 运行）
- **编排**：Docker Compose（开发/生产/服务器三套配置）
- **CI/CD**：GitHub Actions（前后端并行测试 + ESLint + Codecov + Trivy + Gitleaks）
- **云平台**：阿里云 ECS (Ubuntu 22.04)
- **Web 服务器**：Nginx (Alpine)

> **[需要截图：系统架构图（可引用 docs/architecture.md 中的 Mermaid 图或手动绘制）]**

***

## 系统监控与可观测性

项目内置了基础的监控体系，满足课程项目的运维需求：

1. **健康检查**：`GET /health` 返回服务状态、时间戳和版本号，Docker Compose 基于此配置容器健康探针。
2. **请求指标**：`GET /metrics` 实时反馈总请求数、错误率、平均响应时间（基于 MetricsInterceptor + AtomicLong + ThreadLocal 实现）。
3. **结构化日志**：采用 LogstashEncoder 输出 JSON 格式，支持控制台 + 文件双输出，按天滚动保留 7 天，便于后续接入 ELK/Loki。
4. **版本控制**：规范的 Git 分支管理（main/develop/feature）与语义化提交（feat/fix/refactor/test/docs/chore）。

***

## 快速启动

### 方式一：Docker 容器化启动（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/AASSKK99881/Help-1.git
cd Help-1

# 2. 准备环境变量
cp .env.example .env
# 编辑 .env 填入 DB_ROOT_PASSWORD、JWT_SECRET、AI_API_KEY

# 3. 一键启动
docker compose up -d --build

# 4. 验证
curl http://localhost:8080/health
```

### 方式二：本地开发启动

**前端**：
```bash
cd frontend
npm install
npm run dev        # 默认 http://localhost:5173
```

**后端**：
```bash
cd backend/help
./mvnw spring-boot:run   # 默认 http://localhost:8080
```
> 需确保本地已安装 JDK 17+ 和 MySQL 8.0，并执行 `docs/database.md` 中的建表脚本。

***

## 项目结构

```text
Help-1/
├── .github/workflows/          # GitHub Actions (CI / Docker / Security)
├── frontend/                   # React 18 + TypeScript 前端
│   ├── src/app/
│   │   ├── api/                # Axios 接口封装 (auth/tasks/user/activities)
│   │   ├── components/         # 可复用组件 (TaskCard/PointsBadge/TaskStatusBadge)
│   │   ├── contexts/           # React Context (AuthContext)
│   │   ├── layouts/            # 页面布局 (StudentLayout/AdminLayout)
│   │   ├── pages/              # 页面组件 (student/ admin/)
│   │   └── routes.tsx          # 路由配置
│   ├── src/tests/              # Vitest 测试（17 文件 / 111 用例）
│   ├── Dockerfile              # 多阶段构建 (Node + Nginx)
│   └── nginx.conf              # Nginx 非 root 配置
├── backend/help/               # Spring Boot 后端
│   ├── src/main/java/com/help/
│   │   ├── controller/         # RESTful API 控制层
│   │   ├── service/            # 业务逻辑层 (TaskService/AiService)
│   │   ├── mapper/             # MyBatis-Plus 数据访问层
│   │   ├── entity/             # 实体类 (User/Task/Activity/PointsLog)
│   │   └── config/             # 配置层 (JWT/拦截器/异常处理/监控)
│   ├── src/test/               # JUnit + MockMvc 测试
│   ├── Dockerfile              # 多阶段构建 (Maven + JRE)
│   └── pom.xml
├── docs/                       # 项目文档（架构/API/数据库/部署/安全/监控/验收）
├── compose.yaml                # 本地开发 Compose
├── compose.prod.yaml           # 生产环境 Compose（GHCR + Secrets + 资源限制）
├── compose.server.yaml         # 服务器部署 Compose
└── .env.example                # 环境变量模板
```

***

## 相关文档

| 文档 | 说明 |
|------|------|
| [架构设计](./docs/architecture.md) | 系统架构图、前后端模块划分、系统交互流程 |
| [API 接口文档](./docs/api.md) | RESTful API 规范、认证机制、统一响应格式 |
| [数据库设计](./docs/database.md) | ER 图、核心数据表结构、建表脚本 |
| [前端说明](./docs/frontend.md) | 前端技术选型、目录结构、运行方式 |
| [后端说明](./docs/backend.md) | 后端模块功能、技术选型、分层架构 |
| [AI 功能集成](./docs/ai-feature.md) | DeepSeek-V3 集成方案、Prompt 设计、安全管理 |
| [安全审查](./docs/security-review.md) | OWASP Top 10 漏洞修复记录 |
| [云服务部署](./docs/deployment.md) | 阿里云 ECS 部署步骤、安全组配置、问题排查 |
| [监控配置](./docs/monitoring.md) | 健康检查、结构化日志、请求指标 |
| [验收文档](./docs/验收文档.md) | 项目完整验收报告 |

## AI 使用声明

本文档中以下部分由 AI 辅助生成，经人工审核和修改：

| 章节 | AI 工具 | 使用方式 | 人工修改情况 |
|------|---------|----------|-------------|
| README 整体结构 | Claude Code (Claude Opus 4.7) | 参考模板生成初稿 | 已按项目实际功能、技术栈和目录结构人工修订 |
| 项目结构树 | Claude Code | 根据实际文件结构生成 | 已核实验证 |

未在上表中列出的内容均由团队成员独立撰写。

## 第三方库与开源引用

本项目使用的第三方库及开源代码清单：

| 库 / 框架 | 版本 | 用途 | 来源 |
|-----------|------|------|------|
| React | 18.x | 前端核心框架，组件化页面开发 | npm 官方仓库 |
| TypeScript | 5.x | JavaScript 超集，类型安全 | npm 官方仓库 |
| Vite | 5.x | 前端开发服务器与构建工具 | npm 官方仓库 |
| Tailwind CSS | 4.x | 原子化 CSS 方案 | npm 官方仓库 |
| shadcn/ui | latest | UI 组件库 (基于 Radix UI) | npm 官方仓库 |
| Axios | 1.x | HTTP 客户端，接口请求封装 | npm 官方仓库 |
| React Router | 7.x | 前端路由管理 | npm 官方仓库 |
| DOMPurify | 3.x | AI 富文本输出净化，防 XSS | npm 官方仓库 |
| Vitest | 2.x | 前端测试框架 | npm 官方仓库 |
| Spring Boot | 3.2.x | 后端 Web 框架 | Maven Central |
| MyBatis-Plus | 3.5.x | ORM 数据访问层 | Maven Central |
| MySQL Connector | 8.x | Java 连接 MySQL | Maven Central |
| jjwt | 0.12.x | JWT 令牌生成与校验 | Maven Central |
| jbcrypt | 0.4.x | 密码 BCrypt 哈希处理 | Maven Central |
| Logstash Logback Encoder | 7.x | JSON 结构化日志输出 | Maven Central |
| DeepSeek API | - | AI 自动审核委托内容（PASS/REJECT） | DeepSeek 官方 |
| Docker | 26.x | 容器化运行环境 | Docker 官方 |
