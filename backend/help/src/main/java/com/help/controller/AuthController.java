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
}
