package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.help.common.Result;
import com.help.entity.Task;
import com.help.entity.User;
import com.help.mapper.UserMapper;
import com.help.service.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Result<Map<String, Object>> getTasks(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {

        QueryWrapper<Task> wrapper = new QueryWrapper<>();
        // 只展示待接单的任务（进行中/已完成仅在"我的委托"中可见）
        wrapper.eq("status", 1);

        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like("title", keyword).or().like("description", keyword));
        }
        if (category != null && !category.isBlank() && !"全部".equals(category)) {
            wrapper.eq("category", category);
        }
        wrapper.orderByDesc("created_at");

        Page<Task> taskPage = new Page<>(page, size);
        taskPage = taskService.page(taskPage, wrapper);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("total", taskPage.getTotal());
        responseData.put("list", taskPage.getRecords());

        return Result.success(responseData);
    }

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/{id}")
    public Result<Map<String, Object>> getTaskById(@PathVariable Long id) {
        Task task = taskService.getById(id);
        if (task == null) {
            return Result.error("任务不存在");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("task", task);

        // 接取后(status>=2)双方可见联系方式
        if (task.getStatus() >= 2) {
            User publisher = userMapper.selectById(task.getPublisherId());
            if (publisher != null) {
                Map<String, Object> pubInfo = new HashMap<>();
                pubInfo.put("name", task.getIsAnonymous() != null && task.getIsAnonymous() == 1 ? "匿名用户" : publisher.getName());
                pubInfo.put("email", publisher.getEmail());
                pubInfo.put("phone", publisher.getPhone());
                data.put("publisher", pubInfo);
            }
            if (task.getAcceptorId() != null) {
                User acceptor = userMapper.selectById(task.getAcceptorId());
                if (acceptor != null) {
                    Map<String, Object> accInfo = new HashMap<>();
                    accInfo.put("name", acceptor.getName());
                    accInfo.put("email", acceptor.getEmail());
                    accInfo.put("phone", acceptor.getPhone());
                    data.put("acceptor", accInfo);
                }
            }
        }
        return Result.success(data);
    }

    @PostMapping
    public Result<Map<String, Object>> createTask(@RequestBody Task task, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        task.setPublisherId(userId);
        task.setStatus(0);
        task.setCreatedAt(LocalDateTime.now());
        if (task.getIsAnonymous() == null) task.setIsAnonymous(0);

        String reviewMsg = taskService.createAndReviewTask(task);

        Map<String, Object> data = new HashMap<>();
        data.put("task", task);
        data.put("reviewMessage", reviewMsg);
        return Result.success(data);
    }

    @GetMapping("/my/published")
    public Result<Map<String, Object>> getMyPublishedTasks(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<Task> tasks = taskService.getPublishedTasks(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("total", tasks.size());
        data.put("list", tasks);
        return Result.success(data);
    }

    @GetMapping("/my/accepted")
    public Result<Map<String, Object>> getMyAcceptedTasks(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<Task> tasks = taskService.getAcceptedTasks(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("total", tasks.size());
        data.put("list", tasks);
        return Result.success(data);
    }

    @PostMapping("/{id}/accept")
    public Result<String> acceptTask(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            taskService.acceptTask(id, userId);
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

    @PostMapping("/{id}/cancel")
    public Result<String> cancelTask(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            taskService.cancelTask(id, userId);
            return Result.success("任务已取消");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/abandon")
    public Result<String> abandonTask(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            taskService.abandonTask(id, userId);
            return Result.success("已放弃接单，任务已重新开放");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
