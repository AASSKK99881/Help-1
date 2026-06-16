package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.help.config.JwtUtil;
import com.help.entity.*;
import com.help.mapper.*;
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

@WebMvcTest(AdminActivityController.class)
public class AdminActivityControllerTest {

    @Autowired private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    @MockBean private ActivityMapper activityMapper;
    @MockBean private ActivityParticipantMapper participantMapper;
    @MockBean private UserMapper userMapper;
    @MockBean private PointsLogMapper pointsLogMapper;
    @MockBean private JwtUtil jwtUtil;

    private final String authHeader = "Bearer admin-token";

    @BeforeEach
    void setup() {
        when(jwtUtil.isTokenExpired(anyString())).thenReturn(false);
        when(jwtUtil.getRole(anyString())).thenReturn(1);
        when(jwtUtil.getUserId(anyString())).thenReturn(1L);
    }

    @Test
    void listActivities_Success() throws Exception {
        Activity a = new Activity();
        a.setId(1L); a.setTitle("义卖活动"); a.setLocation("操场");
        a.setStartTime(LocalDateTime.now()); a.setEndTime(LocalDateTime.now().plusHours(3));
        a.setRequiredCount(10); a.setPointsReward(30); a.setStatus(0);
        when(activityMapper.selectList(any())).thenReturn(List.of(a));
        when(participantMapper.selectCount(any())).thenReturn(5L);

        mockMvc.perform(get("/api/admin/activities")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("义卖活动"))
                .andExpect(jsonPath("$.data[0].approvedCount").value(5));
    }

    @Test
    void create_Success() throws Exception {
        Activity body = new Activity();
        body.setTitle("新活动"); body.setLocation("图书馆");
        body.setRequiredCount(15); body.setPointsReward(25);
        body.setStartTime(LocalDateTime.now()); body.setEndTime(LocalDateTime.now().plusHours(2));

        mockMvc.perform(post("/api/admin/activities")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.status").value(0));
        verify(activityMapper).insert(any(Activity.class));
    }

    @Test
    void update_Success() throws Exception {
        Activity existing = new Activity();
        existing.setId(1L); existing.setTitle("旧标题");
        when(activityMapper.selectById(1L)).thenReturn(existing);

        Activity body = new Activity();
        body.setTitle("新标题");

        mockMvc.perform(put("/api/admin/activities/1")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.title").value("新标题"));
    }

    @Test
    void detail_Success() throws Exception {
        Activity a = new Activity();
        a.setId(1L); a.setTitle("测试活动");
        when(activityMapper.selectById(1L)).thenReturn(a);
        when(participantMapper.selectList(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/activities/1")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.title").value("测试活动"))
                .andExpect(jsonPath("$.data.participants").isArray());
    }

    @Test
    void endActivity_Success() throws Exception {
        Activity a = new Activity();
        a.setId(1L); a.setStatus(0);
        when(activityMapper.selectById(1L)).thenReturn(a);

        mockMvc.perform(put("/api/admin/activities/1/end")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("活动已结束"));
        assertEquals(2, a.getStatus());
    }

    @Test
    void approveParticipant_Success() throws Exception {
        Activity a = new Activity(); a.setId(1L); a.setRequiredCount(10);
        when(activityMapper.selectById(1L)).thenReturn(a);
        when(participantMapper.selectCount(any())).thenReturn(3L);
        ActivityParticipant p = new ActivityParticipant();
        p.setId(1L); p.setStatus(0);
        when(participantMapper.selectOne(any())).thenReturn(p);

        mockMvc.perform(post("/api/admin/activities/1/approve/2")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("已入选"));
        assertEquals(1, p.getStatus());
    }

    @Test
    void rejectParticipant_Success() throws Exception {
        ActivityParticipant p = new ActivityParticipant();
        p.setId(1L); p.setStatus(0);
        when(participantMapper.selectOne(any())).thenReturn(p);

        mockMvc.perform(post("/api/admin/activities/1/reject/2")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("已拒绝"));
        assertEquals(3, p.getStatus());
    }

    @Test
    void rewardParticipant_Success() throws Exception {
        Activity a = new Activity(); a.setId(1L); a.setTitle("义卖"); a.setPointsReward(30);
        when(activityMapper.selectById(1L)).thenReturn(a);
        ActivityParticipant p = new ActivityParticipant();
        p.setId(1L); p.setStatus(1);
        when(participantMapper.selectOne(any())).thenReturn(p);
        User u = new User(); u.setId(2L); u.setPoints(100); u.setCreditScore(95);
        when(userMapper.selectById(2L)).thenReturn(u);

        mockMvc.perform(post("/api/admin/activities/1/reward/2")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("积分已发放"));
        assertEquals(130, u.getPoints());
        assertEquals(96, u.getCreditScore());
        verify(pointsLogMapper).insert(any(PointsLog.class));
    }

    @Test
    void removeParticipant_Success() throws Exception {
        when(participantMapper.delete(any())).thenReturn(1);

        mockMvc.perform(delete("/api/admin/activities/1/participants/2")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("已剔除"));
    }
}
