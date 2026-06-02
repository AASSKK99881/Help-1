# 监控配置说明

## 概述

本项目为 Help-1 校园积分互助平台配置了基础的可观测性体系，包括健康检查、结构化日志和请求指标收集。

## 1. 健康检查端点

**端点**: `GET /health`

**响应示例**:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-02T10:30:00.123Z",
  "version": "1.0.0"
}
```

实现位置: `backend/help/src/main/java/com/help/controller/HealthController.java`

Docker Compose 中配置了基于此端点的健康检查:
```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 2. 结构化日志

使用 Logstash Logback Encoder 输出 JSON 格式日志，便于日志收集系统（如 ELK、Loki）解析。

配置文件: `backend/help/src/main/resources/logback-spring.xml`

**日志格式示例**:
```json
{
  "time": "2026-06-02T10:30:00.123+08:00",
  "level": "INFO",
  "message": "method=GET uri=/api/tasks status=200 durationMs=45",
  "logger": "com.help.config.MetricsInterceptor",
  "thread": "http-nio-8080-exec-1"
}
```

日志输出:
- **控制台**: JSON 格式，实时查看
- **文件**: `logs/app.log`，按天滚动，保留 7 天

## 3. 请求指标

**端点**: `GET /metrics`

**响应示例**:
```json
{
  "totalRequests": 1523,
  "errorRequests": 12,
  "averageResponseTimeMs": "45.32",
  "errorRate": "0.79%"
}
```

实现方式: `MetricsInterceptor` 拦截器在 `preHandle` 记录请求开始时间，在 `afterCompletion` 计算响应时长并更新计数。

覆盖路径: `/api/**`

## 4. 关键指标说明

| 指标 | 含义 | 告警阈值建议 |
|------|------|-------------|
| totalRequests | 总请求数 | - |
| errorRequests | 4xx/5xx 错误数 | >5% 总请求 |
| averageResponseTimeMs | 平均响应时间 | >500ms |
| errorRate | 错误率 | >5% |

## 5. 目录结构

```
backend/help/src/main/
├── java/com/help/
│   ├── config/
│   │   ├── MetricsInterceptor.java   # 指标拦截器
│   │   └── WebMvcConfig.java         # 拦截器注册
│   └── controller/
│       ├── HealthController.java     # 健康检查
│       └── MetricsController.java    # 指标查询
└── resources/
    └── logback-spring.xml            # 日志配置
```
