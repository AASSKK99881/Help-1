# 项目规则

## 技术栈
- 前端: React 18 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui
- 后端: Spring Boot 3.2 (Java 17) + MyBatis-Plus + MySQL 8.0
- 部署: Docker Compose (目标环境: Ubuntu 22.04)

## 目录结构
- frontend/src/app/components/ - 可复用UI组件
- frontend/src/app/pages/ - 页面组件 (student/ admin/)
- frontend/src/app/api/ - Axios 接口统一调用
- frontend/src/app/contexts/ - React Context (AuthContext)
- backend/help/src/main/java/com/help/controller/ - RESTful API 控制层
- backend/help/src/main/java/com/help/service/ - 核心业务逻辑 (积分、审核)
- docs/ - 架构与数据库设计文档

## 代码规范
- 前端使用 React Hooks + TypeScript 强类型。
- 样式优先使用 Tailwind CSS 类名，结合 shadcn/ui 组件。
- 后端 API 响应必须使用统一的 Result 格式 `{ "code": 0, "message": "success", "data": {} }`。

## 禁止事项
- 不要使用 `any` 类型，必须定义清晰的 TypeScript 接口。
- 不要内联样式，统一使用 Tailwind 或样式表。
- 不要直接操作 DOM，遵循 React 的数据驱动视图思想。
- 严禁前端直接计算积分流水，所有积分增减必须通过后端接口校验与计算。