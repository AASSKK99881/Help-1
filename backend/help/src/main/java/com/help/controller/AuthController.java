package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.help.common.Result;
import com.help.config.JwtUtil;
import com.help.entity.User;
import com.help.mapper.UserMapper;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginReq) {
        String account = loginReq.get("studentId");
        String rawPassword = loginReq.get("password");

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", account).or().eq("email", account);
        queryWrapper.last("LIMIT 1");
        User user = userMapper.selectOne(queryWrapper);

        if (user == null) {
            throw new RuntimeException("该账号/邮箱不存在，请先注册！");
        }

        if (!BCrypt.checkpw(rawPassword, user.getPassword())) {
            throw new RuntimeException("密码错误，请重新输入！");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);

        return Result.success(data);
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody Map<String, String> registerReq) {
        try {
            String name = registerReq.get("name");
            String studentId = registerReq.get("studentId");
            String email = registerReq.get("contactInfo");
            String rawPassword = registerReq.get("password");

            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("username", studentId);
            if (userMapper.selectCount(queryWrapper) > 0) {
                throw new RuntimeException("该学号已被注册！");
            }

            User user = new User();
            user.setUsername(studentId);
            user.setName(name);
            user.setEmail(email);

            String hashedPassword = BCrypt.hashpw(rawPassword, BCrypt.gensalt());
            user.setPassword(hashedPassword);

            user.setRole(0);
            user.setPoints(100); // 新用户注册赠送初始积分
            user.setCreatedAt(LocalDateTime.now());

            userMapper.insert(user);

            return Result.success("注册成功");

        } catch (Exception e) {
            System.err.println("\n================= 捕捉到注册崩溃 =================");
            System.err.println("真正导致 500 错误的原因是：");
            System.err.println(e.getMessage());
            System.err.println("========================================================\n");
            throw new RuntimeException("注册失败");
        }
    }
}
