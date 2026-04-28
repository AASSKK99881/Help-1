# 后端开发贡献说明

**姓名**: 王敏涛
**学号**: 2312190125
**日期**: 2026-04-14

## 我完成的工作

### API 实现
- [√] **用户认证 API**: 实现了 `/api/auth/login` 接口，支持学生与管理员登录并返回模拟 Token。
- [√] **业务资源 CRUD**: 完善了任务（Task）的发布、查询接口。
- [√] **统一错误响应**: 按照要求将成功响应状态码 `code` 统一为 `0`。

### 数据库
- [√] **数据模型定义**: 定义了 `User`、`Task`、`PointsLog` 实体类。
- [√] **ORM 配置**: 使用 MyBatis-Plus 完成数据库操作。

### 部署
- [√] **Dockerfile 编写**: 实现后端镜像的多阶段构建。
- [√] **docker-compose.yml 配置**: 集成 MySQL 8.0 并设置健康检查，确保一键启动。
- [√] **跨域配置**: 在控制器层添加 `@CrossOrigin`，支持前后端联调。

## PR 链接
- PR #1: https://github.com/xxx/xxx/pull/1

## 遇到的问题和解决
1. **问题**: `TaskController` 无法解析 `Map` 符号。
2. **解决**: 手动添加了 `import java.util.Map;` 引用。
3. **问题**: Docker 容器内后端无法连接数据库。
4. **解决**: 将 `application.properties` 中的数据库地址从 `localhost` 改为 `db`。

## 心得体会
掌握了基于 Docker 的容器化部署流程，并深刻理解了前后端约定的响应格式对项目协作的重要性。