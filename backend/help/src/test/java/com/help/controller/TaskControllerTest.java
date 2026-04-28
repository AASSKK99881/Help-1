package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.help.entity.Task;
import com.help.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    // 1. API测试: 创建任务 (正常响应)
    @Test
    void createTask_ReturnsSuccess() throws Exception {
        Task task = new Task();
        task.setTitle("帮我取快递");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.status").value(1));
    }

    // 2. API测试: 成功接取任务
    @Test
    void acceptTask_Success() throws Exception {
        Map<String, Long> payload = new HashMap<>();
        payload.put("studentId", 123L);

        mockMvc.perform(post("/api/tasks/1/accept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("接单成功"));
    }

    // 3. API测试: 接取任务异常 (捕获 Service 抛出的异常)
    @Test
    void acceptTask_ErrorHandled() throws Exception {
        Map<String, Long> payload = new HashMap<>();
        payload.put("studentId", 123L);

        doThrow(new RuntimeException("任务已被接取")).when(taskService).acceptTask(anyLong(), anyLong());

        mockMvc.perform(post("/api/tasks/1/accept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("任务已被接取"));
    }

    // 4. API测试: 成功完成任务
    @Test
    void completeTask_Success() throws Exception {
        mockMvc.perform(post("/api/tasks/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("任务已完成，积分已划转"));
    }
    @Test
    void getTasks_Success() throws Exception {
        mockMvc.perform(get("/api/tasks")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }
}