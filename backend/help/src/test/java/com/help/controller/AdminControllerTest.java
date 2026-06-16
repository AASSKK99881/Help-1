package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.help.config.JwtUtil;
import com.help.entity.*;
import com.help.mapper.*;
import com.help.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
public class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private TaskService taskService;
    @MockBean private UserMapper userMapper;
    @MockBean private PointsLogMapper pointsLogMapper;
    @MockBean private SensitiveWordMapper sensitiveWordMapper;
    @MockBean private JwtUtil jwtUtil;

    private final String authHeader = "Bearer admin-token";

    @BeforeEach
    void setup() {
        when(jwtUtil.isTokenExpired(anyString())).thenReturn(false);
        when(jwtUtil.getRole(anyString())).thenReturn(1);
        when(jwtUtil.getUserId(anyString())).thenReturn(1L);
    }

    // ===== 任务审核 =====

    @Test
    void getPendingTasks_Success() throws Exception {
        Task t = new Task(); t.setId(1L); t.setTitle("待审核任务"); t.setStatus(0);
        when(taskService.getPendingTasks()).thenReturn(List.of(t));

        mockMvc.perform(get("/api/admin/tasks/pending")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.total").value(1));
    }

    @Test
    void approveTask_Success() throws Exception {
        mockMvc.perform(post("/api/admin/tasks/1/approve")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("审核通过"));
        verify(taskService).approveTask(1L);
    }

    @Test
    void approveTask_ErrorHandled() throws Exception {
        doThrow(new RuntimeException("任务状态异常")).when(taskService).approveTask(99L);

        mockMvc.perform(post("/api/admin/tasks/99/approve")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("任务状态异常"));
    }

    @Test
    void rejectTask_Success() throws Exception {
        Map<String, String> body = Map.of("reason", "内容不符");

        mockMvc.perform(post("/api/admin/tasks/2/reject")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("已驳回"));
        verify(taskService).rejectTask(2L, "内容不符");
    }

    // ===== 数据看板 =====

    @Test
    void getStats_Success() throws Exception {
        Task t1 = new Task(); t1.setStatus(3); t1.setCreatedAt(LocalDateTime.now());
        Task t2 = new Task(); t2.setStatus(0);
        when(taskService.list()).thenReturn(List.of(t1, t2));
        User user = new User(); user.setId(1L);
        when(userMapper.selectList(isNull())).thenReturn(List.of(user));

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.totalUsers").value(1))
                .andExpect(jsonPath("$.data.totalTasks").value(2))
                .andExpect(jsonPath("$.data.completedTasks").value(1))
                .andExpect(jsonPath("$.data.pendingReview").value(1));
    }

    // ===== 用户管理 =====

    @Test
    void getUsers_Success() throws Exception {
        User u = new User(); u.setId(1L); u.setName("测试用户");
        when(userMapper.selectList(isNull())).thenReturn(List.of(u));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.total").value(1));
    }

    @Test
    void banUser_Success() throws Exception {
        User u = new User(); u.setId(2L); u.setStatus(0);
        when(userMapper.selectById(2L)).thenReturn(u);

        mockMvc.perform(post("/api/admin/users/2/ban")
                        .header("Authorization", authHeader)
                        .requestAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
        verify(userMapper).updateById(u);
    }

    @Test
    void banUser_AdminProtected() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/ban")
                        .header("Authorization", authHeader)
                        .requestAttr("userId", 1L)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("最高管理员不可被封禁"));
    }

    @Test
    void unbanUser_Success() throws Exception {
        User u = new User(); u.setId(2L); u.setStatus(1);
        when(userMapper.selectById(2L)).thenReturn(u);

        mockMvc.perform(post("/api/admin/users/2/unban")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    @Test
    void adjustPoints_Success() throws Exception {
        User u = new User(); u.setId(2L); u.setPoints(100);
        when(userMapper.selectById(2L)).thenReturn(u);

        Map<String, Object> body = new HashMap<>();
        body.put("amount", 20);
        body.put("reason", "活动奖励");

        mockMvc.perform(post("/api/admin/users/2/points")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    // ===== 敏感词管理 =====

    @Test
    void getKeywords_Success() throws Exception {
        SensitiveWord sw = new SensitiveWord(); sw.setId(1L); sw.setWord("违禁词");
        when(sensitiveWordMapper.selectList(isNull())).thenReturn(List.of(sw));

        mockMvc.perform(get("/api/admin/keywords")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].word").value("违禁词"));
    }

    @Test
    void addKeyword_Success() throws Exception {
        when(sensitiveWordMapper.selectCount(any(com.baomidou.mybatisplus.core.conditions.query.QueryWrapper.class))).thenReturn(0L);
        Map<String, String> body = Map.of("word", "新敏感词");

        mockMvc.perform(post("/api/admin/keywords")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
        verify(sensitiveWordMapper).insert(any(SensitiveWord.class));
    }

    @Test
    void addKeyword_BlankWord() throws Exception {
        Map<String, String> body = Map.of("word", "");

        mockMvc.perform(post("/api/admin/keywords")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("关键词不能为空"));
    }

    @Test
    void deleteKeyword_Success() throws Exception {
        when(sensitiveWordMapper.deleteById(1L)).thenReturn(1);

        mockMvc.perform(delete("/api/admin/keywords/1")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    // ===== 管理员账户管理 =====

    @Test
    void createAdmin_Success() throws Exception {
        when(userMapper.selectCount(any(com.baomidou.mybatisplus.core.conditions.query.QueryWrapper.class))).thenReturn(0L);
        Map<String, String> body = new HashMap<>();
        body.put("name", "新管理员"); body.put("username", "admin02"); body.put("password", "123456");

        mockMvc.perform(post("/api/admin/admins")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("新管理员"))
                .andExpect(jsonPath("$.data.password").doesNotExist());
        verify(userMapper).insert(any(User.class));
    }

    @Test
    void createAdmin_PasswordTooShort() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("name", "管理员"); body.put("username", "admin03"); body.put("password", "12345");

        mockMvc.perform(post("/api/admin/admins")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("密码至少6位"));
    }

    @Test
    void deleteAdmin_Success() throws Exception {
        User u = new User(); u.setId(3L); u.setRole(1);
        when(userMapper.selectById(3L)).thenReturn(u);
        when(userMapper.deleteById(3L)).thenReturn(1);

        mockMvc.perform(delete("/api/admin/admins/3")
                        .header("Authorization", authHeader)
                        .requestAttr("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    @Test
    void deleteAdmin_NotAdmin() throws Exception {
        User u = new User(); u.setId(2L); u.setRole(0);
        when(userMapper.selectById(2L)).thenReturn(u);

        mockMvc.perform(delete("/api/admin/admins/2")
                        .header("Authorization", authHeader)
                        .requestAttr("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("该用户不是管理员"));
    }
}
