# === 阶段 1: 编译打包阶段 ===
# 🎯 在原来的镜像前面加上 docker.1panel.live/ 强制走国内代理节点
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

COPY settings.xml ./
RUN ./mvnw dependency:go-offline -B -s settings.xml
COPY src ./src
RUN ./mvnw package -DskipTests -s settings.xml

# === 阶段 2: 最终运行阶段 ===
# 🎯 同样加上加速前缀
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=builder /build/target/*.jar app.jar
RUN chown -R spring:spring /app

USER spring
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]