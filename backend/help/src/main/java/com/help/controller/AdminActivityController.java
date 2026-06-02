package com.help.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.help.common.Result;
import com.help.entity.*;
import com.help.mapper.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/activities")
@CrossOrigin
public class AdminActivityController {

    @Autowired private ActivityMapper activityMapper;
    @Autowired private ActivityParticipantMapper participantMapper;
    @Autowired private UserMapper userMapper;
    @Autowired private PointsLogMapper pointsLogMapper;

    @GetMapping
    public Result<List<Map<String, Object>>> listActivities() {
        List<Activity> activities = activityMapper.selectList(
                new QueryWrapper<Activity>().orderByDesc("created_at"));
        List<Map<String, Object>> result = new ArrayList<>();
        for (Activity a : activities) {
            Map<String, Object> m = objToMap(a);
            long count = participantMapper.selectCount(
                    new QueryWrapper<ActivityParticipant>().eq("activity_id", a.getId()).eq("status", 1));
            m.put("approvedCount", count);
            result.add(m);
        }
        return Result.success(result);
    }

    @PostMapping
    public Result<Activity> create(@RequestBody Activity activity) {
        activity.setStatus(0);
        activityMapper.insert(activity);
        return Result.success(activity);
    }

    @PutMapping("/{id}")
    public Result<Activity> update(@PathVariable Long id, @RequestBody Activity body) {
        Activity a = activityMapper.selectById(id);
        if (a == null) return Result.error("活动不存在");
        if (body.getTitle() != null) a.setTitle(body.getTitle());
        if (body.getDescription() != null) a.setDescription(body.getDescription());
        if (body.getLocation() != null) a.setLocation(body.getLocation());
        if (body.getStartTime() != null) a.setStartTime(body.getStartTime());
        if (body.getEndTime() != null) a.setEndTime(body.getEndTime());
        if (body.getRequiredCount() != null) a.setRequiredCount(body.getRequiredCount());
        if (body.getPointsReward() != null) a.setPointsReward(body.getPointsReward());
        activityMapper.updateById(a);
        return Result.success(a);
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> detail(@PathVariable Long id) {
        Activity a = activityMapper.selectById(id);
        if (a == null) return Result.error("活动不存在");
        Map<String, Object> data = objToMap(a);

        List<ActivityParticipant> parts = participantMapper.selectList(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id));
        List<Map<String, Object>> participants = new ArrayList<>();
        for (ActivityParticipant p : parts) {
            User u = userMapper.selectById(p.getUserId());
            Map<String, Object> pm = new HashMap<>();
            pm.put("id", p.getId());
            pm.put("userId", p.getUserId());
            pm.put("status", p.getStatus());
            pm.put("creditScore", p.getCreditScore());
            pm.put("appliedAt", p.getAppliedAt());
            if (u != null) {
                pm.put("name", u.getName());
                pm.put("username", u.getUsername());
                pm.put("email", u.getEmail());
            }
            participants.add(pm);
        }
        data.put("participants", participants);
        return Result.success(data);
    }

    @PutMapping("/{id}/end")
    public Result<String> endActivity(@PathVariable Long id) {
        Activity a = activityMapper.selectById(id);
        if (a == null) return Result.error("活动不存在");
        a.setStatus(2);
        activityMapper.updateById(a);
        return Result.success("活动已结束");
    }

    @PostMapping("/{id}/approve/{userId}")
    public Result<String> approveParticipant(@PathVariable Long id, @PathVariable Long userId) {
        Activity a = activityMapper.selectById(id);
        if (a == null) return Result.error("活动不存在");
        long approved = participantMapper.selectCount(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id).eq("status", 1));
        if (approved >= a.getRequiredCount()) return Result.error("名额已满");

        ActivityParticipant p = participantMapper.selectOne(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id).eq("user_id", userId));
        if (p == null) return Result.error("未找到报名记录");
        p.setStatus(1);
        participantMapper.updateById(p);
        return Result.success("已入选");
    }

    @PostMapping("/{id}/reject/{userId}")
    public Result<String> rejectParticipant(@PathVariable Long id, @PathVariable Long userId) {
        ActivityParticipant p = participantMapper.selectOne(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id).eq("user_id", userId));
        if (p == null) return Result.error("未找到报名记录");
        p.setStatus(3);
        participantMapper.updateById(p);
        return Result.success("已拒绝");
    }

    @PostMapping("/{id}/reward/{userId}")
    public Result<String> rewardParticipant(@PathVariable Long id, @PathVariable Long userId) {
        Activity a = activityMapper.selectById(id);
        ActivityParticipant p = participantMapper.selectOne(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id).eq("user_id", userId));
        if (p == null || p.getStatus() != 1) return Result.error("该参与者未入选");

        User u = userMapper.selectById(userId);
        if (u != null) {
            u.setPoints(u.getPoints() + a.getPointsReward());
            u.setCreditScore(u.getCreditScore() + 1);
            userMapper.updateById(u);
        }
        p.setStatus(2);
        participantMapper.updateById(p);

        PointsLog log = new PointsLog();
        log.setUserId(userId);
        log.setAmount(a.getPointsReward());
        log.setType("活动奖励");
        log.setDescription("参与活动'" + a.getTitle() + "'获得积分");
        log.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(log);

        return Result.success("积分已发放");
    }

    @DeleteMapping("/{id}/participants/{userId}")
    public Result<String> removeParticipant(@PathVariable Long id, @PathVariable Long userId) {
        participantMapper.delete(
                new QueryWrapper<ActivityParticipant>().eq("activity_id", id).eq("user_id", userId));
        return Result.success("已剔除");
    }

    private Map<String, Object> objToMap(Activity a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", a.getId());
        m.put("title", a.getTitle());
        m.put("description", a.getDescription());
        m.put("location", a.getLocation());
        m.put("startTime", a.getStartTime());
        m.put("endTime", a.getEndTime());
        m.put("requiredCount", a.getRequiredCount());
        m.put("pointsReward", a.getPointsReward());
        m.put("status", a.getStatus());
        m.put("createdAt", a.getCreatedAt());
        return m;
    }
}
