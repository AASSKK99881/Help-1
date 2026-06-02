package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.help.common.Result;
import com.help.entity.*;
import com.help.mapper.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class StudentActivityController {

    @Autowired private ActivityMapper activityMapper;
    @Autowired private ActivityParticipantMapper participantMapper;
    @Autowired private UserMapper userMapper;

    @GetMapping("/activities")
    public Result<List<Map<String, Object>>> listActivities() {
        List<Activity> activities = activityMapper.selectList(
                new QueryWrapper<Activity>().eq("status", 0).orderByDesc("created_at"));
        List<Map<String, Object>> result = new ArrayList<>();
        for (Activity a : activities) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("title", a.getTitle());
            m.put("description", a.getDescription());
            m.put("location", a.getLocation());
            m.put("startTime", a.getStartTime());
            m.put("endTime", a.getEndTime());
            m.put("requiredCount", a.getRequiredCount());
            m.put("pointsReward", a.getPointsReward());
            long approved = participantMapper.selectCount(
                    new QueryWrapper<ActivityParticipant>().eq("activity_id", a.getId()).eq("status", 1));
            m.put("approvedCount", approved);
            result.add(m);
        }
        return Result.success(result);
    }

    @PostMapping("/activities/{id}/apply")
    public Result<String> apply(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Activity a = activityMapper.selectById(id);
        if (a == null || a.getStatus() != 0) return Result.error("活动不可报名");

        if (participantMapper.selectCount(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id).eq("user_id", userId)) > 0) {
            return Result.error("已报名过该活动");
        }

        User u = userMapper.selectById(userId);
        ActivityParticipant p = new ActivityParticipant();
        p.setActivityId(id);
        p.setUserId(userId);
        p.setStatus(0);
        p.setCreditScore(u != null ? u.getCreditScore() : 100);
        participantMapper.insert(p);
        return Result.success("报名成功，等待审核");
    }

    @GetMapping("/user/my-activities")
    public Result<List<Map<String, Object>>> myActivities(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<ActivityParticipant> parts = participantMapper.selectList(
                new QueryWrapper<ActivityParticipant>().eq("user_id", userId));

        List<Map<String, Object>> result = new ArrayList<>();
        for (ActivityParticipant p : parts) {
            Activity a = activityMapper.selectById(p.getActivityId());
            if (a == null) continue;
            Map<String, Object> m = new HashMap<>();
            m.put("participantId", p.getId());
            m.put("status", p.getStatus());
            m.put("creditScore", p.getCreditScore());
            m.put("appliedAt", p.getAppliedAt());
            m.put("activityId", a.getId());
            m.put("title", a.getTitle());
            m.put("location", a.getLocation());
            m.put("startTime", a.getStartTime());
            m.put("pointsReward", a.getPointsReward());
            String statusLabel;
            switch (p.getStatus()) {
                case 0: statusLabel = "待审核"; break;
                case 1: statusLabel = "已入选"; break;
                case 2: statusLabel = "已完成"; break;
                default: statusLabel = "已放弃";
            }
            m.put("statusLabel", statusLabel);
            result.add(m);
        }
        return Result.success(result);
    }
}
