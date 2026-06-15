package com.help.service;

import com.help.entity.PointsLog;
import com.help.entity.Task;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.TaskMapper;
import com.help.mapper.UserMapper;
import com.help.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceImplTest {

    @Mock
    private TaskMapper taskMapper;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PointsLogMapper pointsLogMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    // 1. 测试接取任务 - 成功情况
    @Test
    void acceptTask_Success() {
        Task mockTask = new Task();
        mockTask.setId(1L);
        mockTask.setStatus(1); // 待接取
        mockTask.setPublisherId(2L); // 发布者不是接单人

        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        taskService.acceptTask(1L, 3L);

        assertEquals(2, mockTask.getStatus());
        assertEquals(3L, mockTask.getAcceptorId());
        verify(taskMapper, times(1)).updateById(mockTask);
    }

    // 2. 测试接取任务 - 异常情况（任务已被接取）
    @Test
    void acceptTask_TaskAlreadyAccepted() {
        Task mockTask = new Task();
        mockTask.setStatus(2); // 进行中
        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.acceptTask(1L, 3L);
        });
        assertEquals("任务不存在或已被接取", exception.getMessage());
    }

    // 3. 测试接取任务 - 异常情况（接取自己发布的任务）
    @Test
    void acceptTask_AcceptOwnTask() {
        Task mockTask = new Task();
        mockTask.setStatus(1);
        mockTask.setPublisherId(3L);
        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.acceptTask(1L, 3L);
        });
        assertEquals("不能接取自己发布的任务", exception.getMessage());
    }

    // 4. 测试完成任务 - 成功情况（包含积分划转）
    @Test
    void completeTask_Success() {
        Task mockTask = new Task();
        mockTask.setId(1L);
        mockTask.setStatus(2); // 进行中
        mockTask.setAcceptorId(3L);
        mockTask.setPointsReward(50);
        mockTask.setPublisherId(2L);

        User mockUser = new User();
        mockUser.setId(3L);
        mockUser.setPoints(100);
        mockUser.setCreditScore(100);

        when(taskMapper.selectById(1L)).thenReturn(mockTask);
        when(userMapper.selectById(3L)).thenReturn(mockUser);

        taskService.completeTask(1L);

        assertEquals(3, mockTask.getStatus());
        assertEquals(150, mockUser.getPoints());
        verify(taskMapper, times(1)).updateById(mockTask);
        verify(userMapper, times(1)).updateById(mockUser);
        verify(pointsLogMapper, times(2)).insert(any(PointsLog.class));
    }

    // 5. 测试完成任务 - 异常情况（任务状态不正确）
    @Test
    void completeTask_InvalidStatus() {
        Task mockTask = new Task();
        mockTask.setStatus(1); // 待接取
        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.completeTask(1L);
        });
        assertEquals("任务状态异常，无法完成", exception.getMessage());
    }
}