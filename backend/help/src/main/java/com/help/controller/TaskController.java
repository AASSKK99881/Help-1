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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 【修复1】返回前端期望的 { total: 数量, list: 数组 } 格式，告别白屏报错
    @GetMapping
    public Result<Map<String, Object>> getTasks(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        Map<String, Object> responseData = new HashMap<>();

        // 此处调用 MybatisPlus 获取全量数据（后续可替换为真正的分页查询 page() 方法）
        // 假设 taskService.list() 已经可用
        responseData.put("total", taskService.count()); // 获取总条数
        responseData.put("list", taskService.list());   // 获取数据列表

        return Result.success(responseData);
    }

    // 【修复2】解开 save 注释，确保数据存入数据库
    @PostMapping
    public Result<Task> createTask(@RequestBody Task task) {
        task.setStatus(1); // 初始状态：待接取
        taskService.save(task); // 👈 注释已解开！
        return Result.success(task);
    }

    @PostMapping("/{id}/accept")
    public Result<String> acceptTask(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        try {
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
}
