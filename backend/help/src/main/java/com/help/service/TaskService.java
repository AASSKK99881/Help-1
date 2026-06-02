package com.help.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.help.entity.Task;

import java.util.List;

public interface TaskService extends IService<Task> {
    void acceptTask(Long taskId, Long studentId);
    void completeTask(Long taskId);
    void cancelTask(Long taskId, Long userId);
    List<Task> getPublishedTasks(Long userId);
    List<Task> getAcceptedTasks(Long userId);
    void approveTask(Long taskId);
    void rejectTask(Long taskId, String reason);
    List<Task> getPendingTasks();
    /** 创建任务并 AI 审核，返回审核结果描述 */
    String createAndReviewTask(Task task);
}
