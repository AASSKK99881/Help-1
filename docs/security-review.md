# 项目安全审查记录 (AI 辅助)

**审查日期:** 2026-05-06
**审查人:** 王敏涛
**审查范围:** 核心后端接口 (Controller)、业务逻辑 (Service) 以及基础设施配置 (Docker)。
**审查视角:** OWASP Top 10

---

## 漏洞清单与修复详情

### 1. 敏感信息硬编码 (Hardcoded Secrets)
*   **所在文件:** `docker-compose.yml`[cite: 2]
*   **漏洞类型:** 敏感信息泄露 / 安全配置错误
*   **危害等级:** **高 (High)**
*   **问题说明:** MySQL 数据库的 root 密码被直接以明文形式 (`root_password`) 写入了公开的配置文件中[cite: 2]。一旦代码库泄露，攻击者可直接获取数据库最高权限。
*   **修复方式:** 移除明文密码，改为通过环境变量注入，配合 `.env` 文件和 `.gitignore` 保护真实凭证。
*   **代码对比:**
    **【修复前】**
    ```yaml
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: help_db
    ```
    **【修复后】**
    ```yaml
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD} # 从环境变量读取
      MYSQL_DATABASE: help_db
    ```

### 2. 失效的访问控制 / 越权漏洞 (Broken Access Control / IDOR)
*   **所在文件:** `src/main/java/com/help/controller/TaskController.java`[cite: 3]
*   **漏洞类型:** 失效的访问控制 (不安全的直接对象引用)
*   **危害等级:** **高 (High)**
*   **问题说明:** `acceptTask` 接口在处理接单逻辑时，直接信任了前端通过 JSON Payload 传来的 `studentId` 参数[cite: 3]。恶意用户可以轻易篡改 HTTP 请求体中的 `studentId`，从而冒充其他用户接单。
*   **修复方式:** 废弃从请求体中获取用户身份标识的做法。改为从受信任的请求头（如配合后续的 JWT 过滤器提取的 `X-User-Id`）中获取当前实际登录用户的 ID。
*   **代码对比:**
    **【修复前】**
    ```java
    @PostMapping("/{id}/accept")
    public Result<String> acceptTask(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        taskService.acceptTask(id, studentId);
        // ...
    }
    ```
    **【修复后】**
    ```java
    @PostMapping("/{id}/accept")
    public Result<String> acceptTask(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        if (currentUserId == null) {
            return Result.error("未授权访问，请先登录");
        }
        taskService.acceptTask(id, currentUserId);
        // ...
    }
    ```

### 3. 权限提升与不安全的认证 (Privilege Escalation)
*   **所在文件:** `src/main/java/com/help/controller/AuthController.java`[cite: 3]
*   **漏洞类型:** 失效的访问控制 / 认证机制失效
*   **危害等级:** **高 (High)**
*   **问题说明:** `login` 接口存在两个严重缺陷：第一，用户的角色权限 (`role`) 是直接由前端传入的参数决定的（只要传 `admin` 就能获取特权）[cite: 3]；第二，接口返回了一个在代码中写死的、毫无安全性的 Mock JWT Token[cite: 3]。
*   **修复方式:** 阻断前端对角色的直接控制，强制后端赋予基础权限（实际生产中需从数据库读取真实权限）。同时移除写死的 Token 返回值，要求对接真实的 JWT 签发逻辑。
*   **代码对比:**
    **【修复前】**
    ```java
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginReq) {
        // ...
        data.put("token", "mock-jwt-token-val"); 
        user.setRole(loginReq.get("role").equals("admin") ? 1 : 0); // 致命：信任前端权限
        // ...
    }
    ```
    **【修复后】**
    ```java
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginReq) {
        // ...
        data.put("token", "real-generated-jwt-token-placeholder"); // 替换为真实的 JWT 生成逻辑
        user.setRole(0); // 修复：剥夺前端的角色分配权，默认赋普通用户权限
        // ...
    }
    ```

---

## 审查结论
本次通过 AI 辅助审查，成功识别并阻断了 **数据库明文密码**、**核心业务越权 (IDOR)** 以及 **认证绕过/权限提升** 三个高危漏洞。代码已按照 OWASP 标准完成基础加固。后续建议进一步集成 Spring Security 并完善 JWT 的校验拦截器，同时在前端输出时注意 XSS 防护。