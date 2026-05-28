package com.help.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.help.entity.Task;

public interface TaskService extends IService<Task> {
    void acceptTask(Long taskId, Long studentId);
    void completeTask(Long taskId);
}