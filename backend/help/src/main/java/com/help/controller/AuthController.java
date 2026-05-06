/*package com.help.controller;

import com.help.common.Result;
import com.help.entity.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginReq) {
        Map<String, Object> data = new HashMap<>();
        data.put("token", "mock-jwt-token-val"); // 模拟 JWT

        User user = new User();
        user.setId(1L);
        user.setUsername("测试用户");
        user.setRole(loginReq.get("role").equals("admin") ? 1 : 0);
        user.setPoints(500);

        data.put("user", user);
        return Result.success(data);
    }
}*/
package com.help.controller;

import com.help.common.Result;
import com.help.entity.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginReq) {
        String username = loginReq.get("username");
        String password = loginReq.get("password"); // 实际应用中需在此处校验数据库中的加密密码

        Map<String, Object> data = new HashMap<>();

        // 【安全修复】：实际项目中应使用如 jjwt 库动态生成真实 Token，此处移除硬编码漏洞
        // String token = JwtUtils.generateToken(user.getId(), user.getRole());
        data.put("token", "real-generated-jwt-token-placeholder");

        User user = new User();
        user.setId(1L);
        user.setUsername(username);

        // 【安全修复】：绝对不能信任前端传入的 role 字段分配管理员权限！
        // 此处强制赋默认值 0 (普通用户)，实际开发中必须从数据库读取。
        user.setRole(0);
        user.setPoints(500);

        data.put("user", user);

        return Result.success(data);
    }
}