package com.help.service;
public interface TaskService {
    void acceptTask(Long taskId, Long studentId);
    void completeTask(Long taskId);
}