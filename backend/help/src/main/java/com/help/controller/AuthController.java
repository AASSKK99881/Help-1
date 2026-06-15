package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.help.common.Result;
import com.help.config.JwtUtil;
import com.help.entity.User;
import com.help.mapper.UserMapper;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

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

        user.setPassword(null);

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);

        return Result.success(data);
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody Map<String, String> registerReq) {
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
        user.setPoints(100);
        user.setCreatedAt(LocalDateTime.now());

        userMapper.insert(user);

        log.info("新用户注册成功: {}", studentId);
        return Result.success("注册成功");
    }
}
