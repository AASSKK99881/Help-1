package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.help.common.Result;
import com.help.entity.PointsLog;
import com.help.entity.SensitiveWord;
import com.help.entity.Task;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.SensitiveWordMapper;
import com.help.mapper.UserMapper;
import com.help.service.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PointsLogMapper pointsLogMapper;

    @Autowired
    private SensitiveWordMapper sensitiveWordMapper;

    // ===== 任务审核 =====

    @GetMapping("/tasks/pending")
    public Result<Map<String, Object>> getPendingTasks() {
        List<Task> tasks = taskService.getPendingTasks();
        Map<String, Object> data = new HashMap<>();
        data.put("total", tasks.size());
        data.put("list", tasks);
        return Result.success(data);
    }

    @PostMapping("/tasks/{id}/approve")
    public Result<String> approveTask(@PathVariable Long id) {
        try {
            taskService.approveTask(id);
            return Result.success("审核通过");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/tasks/{id}/reject")
    public Result<String> rejectTask(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "未说明原因");
            taskService.rejectTask(id, reason);
            return Result.success("已驳回");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // ===== 数据看板 =====

    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        List<Task> allTasks = taskService.list();
        List<User> allUsers = userMapper.selectList(null);

        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream().filter(t -> t.getStatus() == 3).count();
        long pendingReview = allTasks.stream().filter(t -> t.getStatus() == 0).count();
        long inProgress = allTasks.stream().filter(t -> t.getStatus() == 2).count();
        long todayTasks = allTasks.stream()
                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", allUsers.size());
        stats.put("totalTasks", totalTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("pendingReview", pendingReview);
        stats.put("inProgress", inProgress);
        stats.put("todayTasks", todayTasks);

        return Result.success(stats);
    }

    // ===== 用户管理 =====

    @GetMapping("/users")
    public Result<Map<String, Object>> getUsers() {
        List<User> users = userMapper.selectList(null);
        Map<String, Object> data = new HashMap<>();
        data.put("total", users.size());
        data.put("list", users);
        return Result.success(data);
    }

    @PostMapping("/users/{id}/ban")
    public Result<String> banUser(@PathVariable Long id, HttpServletRequest request) {
        Long currentUserId = (Long) request.getAttribute("userId");
        if (id == 1) return Result.error("最高管理员不可被封禁");
        if (id.equals(currentUserId)) return Result.error("不能封禁自己");
        User user = userMapper.selectById(id);
        if (user == null) return Result.error("用户不存在");
        user.setStatus(1);
        userMapper.updateById(user);
        return Result.success("已封禁");
    }

    @PostMapping("/users/{id}/unban")
    public Result<String> unbanUser(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user == null) return Result.error("用户不存在");
        user.setStatus(0);
        userMapper.updateById(user);
        return Result.success("已解封");
    }

    @PostMapping("/users/{id}/points")
    public Result<String> adjustPoints(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User user = userMapper.selectById(id);
        if (user == null) return Result.error("用户不存在");

        int amount = ((Number) body.get("amount")).intValue();
        String reason = (String) body.getOrDefault("reason", "管理员调整");

        user.setPoints(user.getPoints() + amount);
        userMapper.updateById(user);

        PointsLog log = new PointsLog();
        log.setUserId(id);
        log.setAmount(amount);
        log.setType("管理员调整");
        log.setDescription(reason);
        log.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(log);

        return Result.success("调整成功");
    }

    // ===== 敏感词管理 =====

    @GetMapping("/keywords")
    public Result<List<SensitiveWord>> getKeywords() {
        return Result.success(sensitiveWordMapper.selectList(null));
    }

    @PostMapping("/keywords")
    public Result<SensitiveWord> addKeyword(@RequestBody Map<String, String> body) {
        String word = body.get("word");
        if (word == null || word.isBlank()) {
            return Result.error("关键词不能为空");
        }
        // 查重
        if (sensitiveWordMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<SensitiveWord>()
                        .eq("word", word)) > 0) {
            return Result.error("该关键词已存在");
        }
        SensitiveWord sw = new SensitiveWord();
        sw.setWord(word.trim());
        sensitiveWordMapper.insert(sw);
        return Result.success(sw);
    }

    @DeleteMapping("/keywords/{id}")
    public Result<String> deleteKeyword(@PathVariable Long id) {
        int rows = sensitiveWordMapper.deleteById(id);
        if (rows == 0) return Result.error("关键词不存在");
        return Result.success("已删除");
    }

    // ===== 管理员账户管理 =====

    @PostMapping("/admins")
    public Result<User> createAdmin(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String username = body.get("username");
        String password = body.get("password");

        if (name == null || name.isBlank() || username == null || username.isBlank()
                || password == null || password.isBlank()) {
            return Result.error("姓名、学号和密码不能为空");
        }
        if (password.length() < 6) return Result.error("密码至少6位");
        if (userMapper.selectCount(new QueryWrapper<User>().eq("username", username)) > 0) {
            return Result.error("该学号已存在");
        }

        User admin = new User();
        admin.setName(name);
        admin.setUsername(username);
        admin.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
        admin.setRole(1);
        admin.setPoints(0);
        admin.setStatus(0);
        admin.setCreatedAt(LocalDateTime.now());
        userMapper.insert(admin);
        admin.setPassword(null);
        return Result.success(admin);
    }

    @DeleteMapping("/admins/{id}")
    public Result<String> deleteAdmin(@PathVariable Long id, HttpServletRequest request) {
        Long currentUserId = (Long) request.getAttribute("userId");
        if (id == 1) return Result.error("最高管理员不可被删除");
        if (id.equals(currentUserId)) return Result.error("不能删除自己");
        User user = userMapper.selectById(id);
        if (user == null) return Result.error("用户不存在");
        if (user.getRole() != 1) return Result.error("该用户不是管理员");
        userMapper.deleteById(id);
        return Result.success("管理员已删除");
    }
}
