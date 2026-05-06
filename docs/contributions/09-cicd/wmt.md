# CI/CD 配置贡献说明
姓名: 王敏涛 学号:2312190125 角色: 后端 日期: 2026-05-05

## 完成的工作

### 工作流相关
- [x] 参与编写/审查 `.github/workflows/ci.yml`
- [√] 配置 Codecov 覆盖率上传 (backend/frontend flag)
- [x] 添加 README 状态徽章

### 代码适配
- [√] 本地测试命令与CI一致,无需额外配置
- [√] 代码通过 Lint 检查 (Java 项目无需 ruff，通过 Maven 编译检查及 Jacoco 替代)
- [√] 核心覆盖率达标 (>60%)

### 可选项
- [ ] 配置 Dependabot 自动更新依赖
- [ ] 集成 CodeRabbit AI 代码审查
- [ ] 使用 act 本地验证工作流

## PR 链接
- PR #X: https://github.com/Wmt1233/<YOUR_REPO>/pull/X

## CI 运行链接
- https://github.com/Wmt1233/<YOUR_REPO>/actions/runs/XXX

## 遇到的问题和解决
1. 问题: CI环境没有本地 MySQL 数据库，容易导致构建失败。 
   解决: 采用了 Spring Boot 的 MockMVC 以及 Mockito 隔离了数据库依赖，确保 `mvn test` 测试全部通过（运行了 `TaskControllerTest` 等测试用例，`Failures: 0, Errors: 0`），无需在 CI 中额外启动 PostgreSQL/MySQL 容器即可顺利完成验证。

## 心得体会
通过本次项目的 CI/CD 配置实践，深入了解了持续集成在前后端分离架构中的价值。成功将 Java/Maven 的编译测试与 Jacoco 覆盖率统一集成到 GitHub Actions 中，并保障了与 Vue 前端工作流的并行运行，极大地提高了代码合并后的质量保障效率。