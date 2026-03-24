package com.help.controller;

import com.help.common.Result;
import com.help.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin // 允许前端跨域请求
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 模拟学生接单 API
    @PostMapping("/{id}/accept")
    public Result<String> acceptTask(@PathVariable Long id, @RequestParam Long studentId) {
        try {
            // 真实项目中 studentId 应该从 JWT Token 中解析，这里为演示简化为参数传递
            taskService.acceptTask(id, studentId);
            return Result.success("接单成功！");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // 模拟完成任务与积分划转 API
    @PostMapping("/{id}/complete")
    public Result<String> completeTask(@PathVariable Long id) {
        try {
            taskService.completeTask(id);
            return Result.success("任务已完成，积分已划转！");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}