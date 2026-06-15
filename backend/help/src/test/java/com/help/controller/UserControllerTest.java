package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.help.config.JwtUtil;
import com.help.entity.PointsLog;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private UserMapper userMapper;
    @MockBean private PointsLogMapper pointsLogMapper;
    @MockBean private JwtUtil jwtUtil;

    @BeforeEach
    void setup() {
        when(jwtUtil.isTokenExpired(anyString())).thenReturn(false);
        when(jwtUtil.getUserId(anyString())).thenReturn(1L);
        when(jwtUtil.getRole(anyString())).thenReturn(0);
    }

    private final String authHeader = "Bearer test-token";

    @Test
    void getProfile_Success() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L); mockUser.setName("测试用户");
        mockUser.setEmail("test@edu.cn"); mockUser.setPassword("hashed");
        when(userMapper.selectById(1L)).thenReturn(mockUser);

        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("测试用户"));
    }

    @Test
    void getPointsHistory_Success() throws Exception {
        PointsLog log = new PointsLog();
        log.setId(1L); log.setUserId(1L); log.setAmount(20);
        log.setType("任务奖励"); log.setCreatedAt(java.time.LocalDateTime.now());
        when(pointsLogMapper.selectList(any())).thenReturn(List.of(log));

        mockMvc.perform(get("/api/user/points-history")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.total").value(1));
    }

    @Test
    void updateProfile_Success() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L); mockUser.setName("旧名字");
        when(userMapper.selectById(1L)).thenReturn(mockUser);

        Map<String, String> body = new HashMap<>();
        body.put("name", "新名字"); body.put("email", "new@edu.cn");

        mockMvc.perform(put("/api/user/profile")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
        verify(userMapper).updateById(mockUser);
    }

    @Test
    void updateProfile_UserNotFound() throws Exception {
        when(userMapper.selectById(99L)).thenReturn(null);
        when(jwtUtil.getUserId(anyString())).thenReturn(99L);

        mockMvc.perform(put("/api/user/profile")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("用户不存在"));
    }

    @Test
    void changePassword_Success() throws Exception {
        String hashedPw = BCrypt.hashpw("oldPass", BCrypt.gensalt());
        User mockUser = new User();
        mockUser.setId(1L); mockUser.setPassword(hashedPw);
        when(userMapper.selectById(1L)).thenReturn(mockUser);

        Map<String, String> body = new HashMap<>();
        body.put("currentPassword", "oldPass");
        body.put("newPassword", "newPass123");

        mockMvc.perform(put("/api/user/change-password")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("密码修改成功"));
    }

    @Test
    void changePassword_WrongCurrentPassword() throws Exception {
        String hashedPw = BCrypt.hashpw("correctPass", BCrypt.gensalt());
        User mockUser = new User();
        mockUser.setId(1L); mockUser.setPassword(hashedPw);
        when(userMapper.selectById(1L)).thenReturn(mockUser);

        Map<String, String> body = new HashMap<>();
        body.put("currentPassword", "wrongPass");
        body.put("newPassword", "newPass123");

        mockMvc.perform(put("/api/user/change-password")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("当前密码错误"));
    }

    @Test
    void changePassword_PasswordTooShort() throws Exception {
        String hashedPw = BCrypt.hashpw("oldPass", BCrypt.gensalt());
        User mockUser = new User();
        mockUser.setId(1L); mockUser.setPassword(hashedPw);
        when(userMapper.selectById(1L)).thenReturn(mockUser);

        Map<String, String> body = new HashMap<>();
        body.put("currentPassword", "oldPass");
        body.put("newPassword", "12345");

        mockMvc.perform(put("/api/user/change-password")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("新密码至少6位"));
    }

    @Test
    void changePassword_MissingParams() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L);
        when(userMapper.selectById(1L)).thenReturn(mockUser);

        mockMvc.perform(put("/api/user/change-password")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("参数不完整"));
    }
}
