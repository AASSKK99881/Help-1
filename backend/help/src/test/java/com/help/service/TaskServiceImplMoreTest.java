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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceImplMoreTest {

    @Mock private TaskMapper taskMapper;
    @Mock private UserMapper userMapper;
    @Mock private PointsLogMapper pointsLogMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    // ===== cancelTask 测试 =====

    @Test
    void cancelTask_StatusPending_RefundFull() {
        Task mockTask = new Task();
        mockTask.setId(1L); mockTask.setStatus(1); // 待接单
        mockTask.setPointsReward(50); mockTask.setPublisherId(2L);

        User publisher = new User();
        publisher.setId(2L); publisher.setPoints(100);

        when(taskMapper.selectById(1L)).thenReturn(mockTask);
        when(userMapper.selectById(2L)).thenReturn(publisher);

        taskService.cancelTask(1L, 2L);

        assertEquals(150, publisher.getPoints()); // 全额退还
        assertEquals(4, mockTask.getStatus());
        verify(pointsLogMapper, times(1)).insert(any(PointsLog.class)); // 退还日志
    }

    @Test
    void cancelTask_StatusInProgress_Penalty() {
        Task mockTask = new Task();
        mockTask.setId(1L); mockTask.setStatus(2); // 进行中
        mockTask.setPointsReward(50); mockTask.setPublisherId(2L);

        User publisher = new User();
        publisher.setId(2L); publisher.setPoints(100); publisher.setCreditScore(100);

        when(taskMapper.selectById(1L)).thenReturn(mockTask);
        when(userMapper.selectById(2L)).thenReturn(publisher);

        taskService.cancelTask(1L, 2L);

        assertEquals(140, publisher.getPoints()); // 100 + (50-10) = 140
        assertEquals(95, publisher.getCreditScore()); // -5
        assertEquals(4, mockTask.getStatus());
        verify(pointsLogMapper, times(2)).insert(any(PointsLog.class)); // 违约金 + 退还
    }

    @Test
    void cancelTask_NotPublisher() {
        Task mockTask = new Task();
        mockTask.setId(1L); mockTask.setPublisherId(2L);
        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                taskService.cancelTask(1L, 99L));
        assertEquals("只有发布者可以取消任务", ex.getMessage());
    }

    @Test
    void cancelTask_TaskNotFound() {
        when(taskMapper.selectById(1L)).thenReturn(null);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                taskService.cancelTask(1L, 2L));
        assertEquals("任务不存在", ex.getMessage());
    }

    // ===== approveTask 测试 =====

    @Test
    void approveTask_Success() {
        Task mockTask = new Task();
        mockTask.setId(1L); mockTask.setStatus(0); mockTask.setPointsReward(30);
        mockTask.setPublisherId(2L);

        User publisher = new User();
        publisher.setId(2L); publisher.setPoints(100);

        when(taskMapper.selectById(1L)).thenReturn(mockTask);
        when(userMapper.selectById(2L)).thenReturn(publisher);

        taskService.approveTask(1L);

        assertEquals(1, mockTask.getStatus());
        assertEquals(70, publisher.getPoints()); // 100 - 30
        verify(pointsLogMapper).insert(any(PointsLog.class));
    }

    @Test
    void approveTask_InsufficientPoints() {
        Task mockTask = new Task();
        mockTask.setId(1L); mockTask.setStatus(0); mockTask.setPointsReward(200);
        mockTask.setPublisherId(2L);

        User publisher = new User();
        publisher.setId(2L); publisher.setPoints(50);

        when(taskMapper.selectById(1L)).thenReturn(mockTask);
        when(userMapper.selectById(2L)).thenReturn(publisher);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                taskService.approveTask(1L));
        assertEquals("发布者积分不足", ex.getMessage());
    }

    @Test
    void approveTask_InvalidStatus() {
        Task mockTask = new Task();
        mockTask.setStatus(1); // 非待审核
        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                taskService.approveTask(1L));
        assertEquals("任务状态异常，无法审核", ex.getMessage());
    }

    // ===== rejectTask 测试 =====

    @Test
    void rejectTask_Success() {
        Task mockTask = new Task();
        mockTask.setId(1L); mockTask.setStatus(0); mockTask.setPublisherId(2L);
        when(taskMapper.selectById(1L)).thenReturn(mockTask);

        taskService.rejectTask(1L, "内容重复");

        assertEquals(4, mockTask.getStatus());
        verify(pointsLogMapper).insert(any(PointsLog.class));
    }

    // ===== getPublishedTasks / getAcceptedTasks 测试 =====

    @Test
    void getPublishedTasks_ReturnsList() {
        Task t = new Task(); t.setId(1L); t.setTitle("测试");
        when(taskMapper.selectList(any())).thenReturn(List.of(t));

        List<Task> result = taskService.getPublishedTasks(1L);

        assertEquals(1, result.size());
        assertEquals("测试", result.get(0).getTitle());
    }

    @Test
    void getAcceptedTasks_ReturnsList() {
        Task t = new Task(); t.setId(2L); t.setTitle("代取快递");
        when(taskMapper.selectList(any())).thenReturn(List.of(t));

        List<Task> result = taskService.getAcceptedTasks(1L);

        assertEquals(1, result.size());
        assertEquals("代取快递", result.get(0).getTitle());
    }

    // ===== getPendingTasks 测试 =====

    @Test
    void getPendingTasks_ReturnsList() {
        Task t = new Task(); t.setId(3L); t.setStatus(0);
        when(taskMapper.selectList(any())).thenReturn(List.of(t));

        List<Task> result = taskService.getPendingTasks();

        assertEquals(1, result.size());
        assertEquals(0, result.get(0).getStatus());
    }
}
