package com.help.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.help.entity.PointsLog;
import com.help.entity.Task;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.TaskMapper;
import com.help.mapper.UserMapper;
import com.help.service.AiService;
import com.help.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements TaskService {

    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PointsLogMapper pointsLogMapper;
    @Autowired
    private AiService aiService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void acceptTask(Long taskId, Long studentId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 1) {
            throw new RuntimeException("任务不存在或已被接取");
        }
        if (task.getPublisherId().equals(studentId)) {
            throw new RuntimeException("不能接取自己发布的任务");
        }

        task.setStatus(2);
        task.setAcceptorId(studentId);
        taskMapper.updateById(task);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void completeTask(Long taskId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 2) {
            throw new RuntimeException("任务状态异常，无法完成");
        }

        task.setStatus(3);
        taskMapper.updateById(task);

        User acceptor = userMapper.selectById(task.getAcceptorId());
        acceptor.setPoints(acceptor.getPoints() + task.getPointsReward());
        acceptor.setCreditScore(acceptor.getCreditScore() + 1);
        userMapper.updateById(acceptor);

        PointsLog log = new PointsLog();
        log.setUserId(acceptor.getId());
        log.setTaskId(taskId);
        log.setAmount(task.getPointsReward());
        log.setType("任务奖励");
        log.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(log);

        // 积分已在审核时扣除，完成时不再重复记录
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelTask(Long taskId, Long userId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        if (!task.getPublisherId().equals(userId)) {
            throw new RuntimeException("只有发布者可以取消任务");
        }

        int refund = 0;
        int penalty = 0;
        User publisher = userMapper.selectById(task.getPublisherId());

        if (task.getStatus() == 0) {
            // 待审核：积分从未冻结，直接取消
            refund = 0;
        } else if (task.getStatus() == 1) {
            // 待接单：积分已冻结，全额退还
            refund = task.getPointsReward();
            publisher.setPoints(publisher.getPoints() + refund);
            userMapper.updateById(publisher);
        } else if (task.getStatus() == 2) {
            // 进行中取消：扣除 20% 违约金 + 扣信誉分
            penalty = Math.max(1, (int) (task.getPointsReward() * 0.2));
            refund = task.getPointsReward() - penalty;
            publisher.setPoints(publisher.getPoints() + refund);
            publisher.setCreditScore(Math.max(0, publisher.getCreditScore() - 5));
            userMapper.updateById(publisher);

            PointsLog penaltyLog = new PointsLog();
            penaltyLog.setUserId(task.getPublisherId());
            penaltyLog.setTaskId(taskId);
            penaltyLog.setAmount(-penalty);
            penaltyLog.setType("违约扣除");
            penaltyLog.setDescription("取消进行中任务，扣除" + penalty + "积分违约金");
            penaltyLog.setCreatedAt(LocalDateTime.now());
            pointsLogMapper.insert(penaltyLog);
        } else {
            throw new RuntimeException("当前状态不可取消");
        }

        if (refund > 0) {
            PointsLog refundLog = new PointsLog();
            refundLog.setUserId(task.getPublisherId());
            refundLog.setTaskId(taskId);
            refundLog.setAmount(refund);
            refundLog.setType("积分退还");
            refundLog.setDescription("取消任务，退还" + refund + "积分");
            refundLog.setCreatedAt(LocalDateTime.now());
            pointsLogMapper.insert(refundLog);
        }

        task.setStatus(4);
        taskMapper.updateById(task);
    }

    @Override
    public List<Task> getPublishedTasks(Long userId) {
        QueryWrapper<Task> wrapper = new QueryWrapper<>();
        wrapper.eq("publisher_id", userId).orderByDesc("created_at");
        return taskMapper.selectList(wrapper);
    }

    @Override
    public List<Task> getAcceptedTasks(Long userId) {
        QueryWrapper<Task> wrapper = new QueryWrapper<>();
        wrapper.eq("acceptor_id", userId).orderByDesc("created_at");
        return taskMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approveTask(Long taskId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 0) {
            throw new RuntimeException("任务状态异常，无法审核");
        }

        // 冻结发布者积分
        User publisher = userMapper.selectById(task.getPublisherId());
        if (publisher.getPoints() < task.getPointsReward()) {
            throw new RuntimeException("发布者积分不足");
        }
        publisher.setPoints(publisher.getPoints() - task.getPointsReward());
        userMapper.updateById(publisher);

        // 记录积分支出
        PointsLog freezeLog = new PointsLog();
        freezeLog.setUserId(publisher.getId());
        freezeLog.setTaskId(taskId);
        freezeLog.setAmount(-task.getPointsReward());
        freezeLog.setType("积分支出");
        freezeLog.setDescription("发布任务，扣除悬赏积分");
        freezeLog.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(freezeLog);

        // 状态改为待接单
        task.setStatus(1);
        taskMapper.updateById(task);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void rejectTask(Long taskId, String reason) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 0) {
            throw new RuntimeException("任务状态异常，无法审核");
        }

        task.setStatus(4); // 已取消
        taskMapper.updateById(task);

        // 记录驳回（无需退积分，因为审核前未扣积分）
        PointsLog rejectLog = new PointsLog();
        rejectLog.setUserId(task.getPublisherId());
        rejectLog.setTaskId(taskId);
        rejectLog.setAmount(0);
        rejectLog.setType("审核驳回");
        rejectLog.setDescription("审核驳回，原因：" + reason);
        rejectLog.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(rejectLog);
    }

    @Override
    public List<Task> getPendingTasks() {
        QueryWrapper<Task> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 0).orderByDesc("created_at");
        return taskMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createAndReviewTask(Task task) {
        taskMapper.insert(task);

        // AI 审核
        Map<String, Object> reviewResult = aiService.reviewTaskContent(
                task.getTitle(), task.getDescription(), null);

        boolean passed = (boolean) reviewResult.get("passed");
        String reason = (String) reviewResult.get("reason");

        if (passed) {
            this.approveTask(task.getId());
            return "审核通过，AI判断：" + reason;
        } else {
            this.rejectTask(task.getId(), "AI审核驳回：" + reason);
            return "审核未通过，AI判断：" + reason;
        }
    }
}
