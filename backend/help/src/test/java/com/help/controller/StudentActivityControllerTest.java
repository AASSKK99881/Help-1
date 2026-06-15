package com.help.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentActivityController.class)
public class StudentActivityControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private ActivityMapper activityMapper;
    @MockBean private ActivityParticipantMapper participantMapper;
    @MockBean private UserMapper userMapper;
    @MockBean private JwtUtil jwtUtil;

    private final String authHeader = "Bearer test-token";

    @BeforeEach
    void setup() {
        when(jwtUtil.isTokenExpired(anyString())).thenReturn(false);
        when(jwtUtil.getUserId(anyString())).thenReturn(1L);
        when(jwtUtil.getRole(anyString())).thenReturn(0);
    }

    @Test
    void listActivities_Empty() throws Exception {
        when(activityMapper.selectList(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/activities")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void listActivities_WithData() throws Exception {
        Activity a = new Activity();
        a.setId(1L); a.setTitle("义卖活动"); a.setLocation("操场");
        a.setRequiredCount(10); a.setPointsReward(30);
        a.setStartTime(java.time.LocalDateTime.now());
        a.setEndTime(java.time.LocalDateTime.now().plusHours(4));

        when(activityMapper.selectList(any())).thenReturn(List.of(a));
        when(participantMapper.selectCount(any())).thenReturn(3L);

        mockMvc.perform(get("/api/activities")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("义卖活动"))
                .andExpect(jsonPath("$.data[0].approvedCount").value(3));
    }

    @Test
    void apply_Success() throws Exception {
        Activity a = new Activity();
        a.setId(1L); a.setStatus(0);
        User u = new User();
        u.setId(1L); u.setCreditScore(95);

        when(activityMapper.selectById(1L)).thenReturn(a);
        when(participantMapper.selectCount(any())).thenReturn(0L);
        when(userMapper.selectById(1L)).thenReturn(u);

        mockMvc.perform(post("/api/activities/1/apply")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value("报名成功，等待审核"));
        verify(participantMapper).insert(any());
    }

    @Test
    void apply_ActivityNotFound() throws Exception {
        when(activityMapper.selectById(99L)).thenReturn(null);

        mockMvc.perform(post("/api/activities/99/apply")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("活动不可报名"));
    }

    @Test
    void apply_AlreadyApplied() throws Exception {
        Activity a = new Activity();
        a.setId(1L); a.setStatus(0);
        when(activityMapper.selectById(1L)).thenReturn(a);
        when(participantMapper.selectCount(any())).thenReturn(1L);

        mockMvc.perform(post("/api/activities/1/apply")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("已报名过该活动"));
    }

    @Test
    void myActivities_Empty() throws Exception {
        when(participantMapper.selectList(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/user/my-activities")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void myActivities_WithData() throws Exception {
        ActivityParticipant p = new ActivityParticipant();
        p.setId(1L); p.setActivityId(1L); p.setUserId(1L);
        p.setStatus(1); p.setCreditScore(95);
        p.setAppliedAt(java.time.LocalDateTime.now());

        Activity a = new Activity();
        a.setId(1L); a.setTitle("志愿活动"); a.setLocation("图书馆");
        a.setPointsReward(20);

        when(participantMapper.selectList(any())).thenReturn(List.of(p));
        when(activityMapper.selectById(1L)).thenReturn(a);

        mockMvc.perform(get("/api/user/my-activities")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("志愿活动"))
                .andExpect(jsonPath("$.data[0].statusLabel").value("已入选"));
    }
}
