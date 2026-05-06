/*package com.help.controller;

import com.help.common.Result;
import com.help.entity.Task;
import com.help.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // 修复：必须引入 Map

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Result<List<Task>> getTasks(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        // 按照作业要求，此处应有逻辑返回数据
        return Result.success(null);
    }

    @PostMapping
    public Result<Task> createTask(@RequestBody Task task) {
        task.setStatus(1); // 初始状态：待接取
        // taskService.save(task);
        return Result.success(task);
    }

    @PostMapping("/{id}/accept")
    public Result<String> acceptTask(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        try {
            // 修复：现在 payload.get 可以正常解析
            Long studentId = payload.get("studentId");
            taskService.acceptTask(id, studentId);
            return Result.success("接单成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/complete")
    public Result<String> completeTask(@PathVariable Long id) {
        try {
            taskService.completeTask(id);
            return Result.success("任务已完成，积分已划转");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}*/
package com.help.controller;

import com.help.common.Result;
import com.help.entity.Task;
import com.help.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Result<List<Task>> getTasks(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        // 待实现分页查询
        return Result.success(null);
    }

    @PostMapping
    public Result<Task> createTask(@RequestBody Task task) {
        task.setStatus(1); // 默认状态
        // taskService.save(task);
        return Result.success(task);
    }

    @PostMapping("/{id}/accept")
    // 【安全修复】：不再从 @RequestBody 中获取 studentId，而是从 Header 中获取可信的当前用户 ID
    public Result<String> acceptTask(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        try {
            if (currentUserId == null) {
                return Result.error("未授权访问，请先登录");
            }
            taskService.acceptTask(id, currentUserId);
            return Result.success("任务接受成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/complete")
    // 【安全修复】：补充当前操作者 ID 供后续鉴权使用
    public Result<String> completeTask(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) Long currentUserId) {
        try {
            if (currentUserId == null) {
                return Result.error("未授权访问，请先登录");
            }
            // 业务逻辑层应增加校验：判断 currentUserId 是否等于 task.getPublisherId() 或 task.getAcceptorId()
            taskService.completeTask(id);
            return Result.success("任务完成");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}