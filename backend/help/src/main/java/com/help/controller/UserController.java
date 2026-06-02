package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.help.common.Result;
import com.help.entity.PointsLog;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PointsLogMapper pointsLogMapper;

    @GetMapping("/profile")
    public Result<User> getProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userMapper.selectById(userId);
        if (user != null) user.setPassword(null);
        return Result.success(user);
    }

    @GetMapping("/points-history")
    public Result<Map<String, Object>> getPointsHistory(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        QueryWrapper<PointsLog> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId).orderByDesc("created_at");
        List<PointsLog> logs = pointsLogMapper.selectList(wrapper);

        Map<String, Object> data = new HashMap<>();
        data.put("total", logs.size());
        data.put("list", logs);
        return Result.success(data);
    }

    @PutMapping("/profile")
    public Result<User> updateProfile(@RequestBody Map<String, String> body, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userMapper.selectById(userId);
        if (user == null) return Result.error("用户不存在");

        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userMapper.updateById(user);
        user.setPassword(null);
        return Result.success(user);
    }

    @PutMapping("/change-password")
    public Result<String> changePassword(@RequestBody Map<String, String> body, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userMapper.selectById(userId);
        if (user == null) return Result.error("用户不存在");

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return Result.error("参数不完整");
        }
        if (!BCrypt.checkpw(currentPassword, user.getPassword())) {
            return Result.error("当前密码错误");
        }
        if (newPassword.length() < 6) {
            return Result.error("新密码至少6位");
        }

        user.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        userMapper.updateById(user);
        return Result.success("密码修改成功");
    }
}
