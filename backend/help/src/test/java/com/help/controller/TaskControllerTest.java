package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.help.config.JwtUtil;
import com.help.entity.Task;
import com.help.mapper.UserMapper;
import com.help.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserMapper userMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private void mockAuth() {
        when(jwtUtil.isTokenExpired(anyString())).thenReturn(false);
        when(jwtUtil.getUserId(anyString())).thenReturn(1L);
        when(jwtUtil.getRole(anyString())).thenReturn(0);
    }

    @Test
    void createTask_ReturnsSuccess() throws Exception {
        mockAuth();
        Task task = new Task();
        task.setTitle("帮我取快递");

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer test-token")
                        .requestAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    @Test
    void acceptTask_Success() throws Exception {
        mockAuth();

        mockMvc.perform(post("/api/tasks/1/accept")
                        .header("Authorization", "Bearer test-token")
                        .requestAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("接单成功"));
    }

    @Test
    void acceptTask_ErrorHandled() throws Exception {
        mockAuth();
        doThrow(new RuntimeException("任务已被接取")).when(taskService).acceptTask(anyLong(), anyLong());

        mockMvc.perform(post("/api/tasks/1/accept")
                        .header("Authorization", "Bearer test-token")
                        .requestAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("任务已被接取"));
    }

    @Test
    void completeTask_Success() throws Exception {
        mockAuth();
        mockMvc.perform(post("/api/tasks/1/complete")
                        .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("任务已完成，积分已划转"));
    }

    @Test
    void getTasks_Success() throws Exception {
        mockAuth();
        when(taskService.list()).thenReturn(java.util.List.of());

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer test-token")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }
}
