# 阶段 1: 构建
# 建议构建阶段也加上 alpine 减小拉取体积
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# 优化构建缓存：先单独复制 pom.xml 下载依赖
COPY pom.xml .
RUN mvn dependency:go-offline

# 复制源码并打包
COPY src ./src
RUN mvn clean package -DskipTests

# 阶段 2: 运行
# 必须改用 alpine 变体以大幅减小镜像体积
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 核心修改：创建非 root 用户并分配工作目录权限
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

# 从构建阶段复制 jar 包
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# 核心修改：增加健康检查端点
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]