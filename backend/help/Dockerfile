# === 阶段 1: 编译构建 ===
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# 分层缓存 Maven 依赖
COPY pom.xml ./
COPY settings.xml ./
RUN mvn dependency:go-offline -B -s settings.xml

# 复制源码并打包（跳过测试，测试应在 CI 中完成）
COPY src ./src
RUN mvn package -DskipTests -B -s settings.xml

# === 阶段 2: 运行时 ===
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 创建非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 复制 JAR
COPY --from=builder /build/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
