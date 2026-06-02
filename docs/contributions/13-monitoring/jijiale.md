# 监控配置贡献说明

姓名：纪嘉乐
学号：2312190109
角色：前端
日期：2026-06-02

## 我完成的工作

### 1. 日志配置
- [x] **结构化日志格式**: 审查并确认后端 `logback-spring.xml` 使用 LogstashEncoder 输出 JSON 格式日志，支持控制台和文件双输出。
- [x] **日志级别配置**: 根日志级别设为 INFO，文件按天滚动保留 7 天。

### 2. 健康检查
- [x] **/health 端点**: 审查 `HealthController` 返回 `{"status":"healthy","timestamp":"...","version":"1.0.0"}`。
- [x] **Docker 健康检查**: 在 compose.yaml 和 compose.prod.yaml 中配置了基于 `/health` 的 wget 轮询检查。

### 3. 指标收集
- [x] **请求计数**: `MetricsInterceptor` 使用 `AtomicLong` 线程安全计数。
- [x] **响应时间**: 通过 `ThreadLocal` 记录请求开始时间，`afterCompletion` 计算耗时。
- [x] **错误率**: 统计 status >= 400 的请求，计算百分比。
- [x] **指标查询**: `/metrics` 端点返回 JSON 格式的指标数据。

### 4. 文档
- [x] **monitoring.md**: 编写了完整的监控配置说明文档，包含端点、日志格式、指标说明和告警阈值建议。

---

## PR 链接
- PR #X: https://github.com/AASSKK99881/Help-1/pull/X (根据实际 PR 填写)

---

## 遇到的问题和解决
1. **问题**: 拦截器只能覆盖 `/api/**` 路径，/health 和 /metrics 自身不会被统计。
   **解决**: 在 `WebMvcConfig` 中通过 `excludePathPatterns` 排除自身端点，避免递归统计。这是正确的设计——监控端点本身不应计入业务指标。

2. **问题**: JSON 日志在本地终端查看不便。
   **解决**: 保留控制台 JSON 输出用于生产日志收集，本地开发时可切换为 `ConsoleAppender` + 普通格式。

---

## AI 使用情况
- 使用了哪些 Prompt:
  - "Spring Boot 如何使用拦截器实现请求计数和响应时间统计"
  - "Logstash Logback Encoder 如何配置 JSON 格式日志输出"
- AI 帮助解决了哪些问题:
  1. 提供了 MetricsInterceptor 的 ThreadLocal + AtomicLong 实现方案
  2. 协助编写了 logback-spring.xml 的 LogstashEncoder 配置

---

## 心得体会
通过本次监控配置实践，我理解了可观测性的三大支柱：日志(logging)、指标(metrics)和健康检查(health check)。结构化 JSON 日志为后续接入 ELK/Loki 等日志平台打下了基础；请求指标拦截器无需引入重型框架即可实现基本的 APM 功能。这些基础监控手段对于快速定位线上问题至关重要。
