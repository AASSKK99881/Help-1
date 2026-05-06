/*package com.help.service.impl;

import com.help.entity.PointsLog;
import com.help.entity.Task;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.TaskMapper;
import com.help.mapper.UserMapper;
import com.help.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskMapper taskMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PointsLogMapper pointsLogMapper;

    @Override
    @Transactional(rollbackFor = Exception.class) // 开启数据库事务
    public void acceptTask(Long taskId, Long studentId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 1) {
            throw new RuntimeException("任务不存在或已被接取");
        }
        if (task.getPublisherId().equals(studentId)) {
            throw new RuntimeException("不能接取自己发布的任务");
        }

        // 更新任务状态为进行中(2)，并记录接单人
        task.setStatus(2);
        task.setAcceptorId(studentId);
        taskMapper.updateById(task);
    }

    @Override
    @Transactional(rollbackFor = Exception.class) // 开启数据库事务，保证积分划转强一致性
    public void completeTask(Long taskId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 2) {
            throw new RuntimeException("任务状态异常，无法完成");
        }

        // 1. 更新任务为已完成(3)
        task.setStatus(3);
        taskMapper.updateById(task);

        // 2. 给接单人增加积分
        User acceptor = userMapper.selectById(task.getAcceptorId());
        acceptor.setPoints(acceptor.getPoints() + task.getPointsReward());
        userMapper.updateById(acceptor);

        // 3. 记录积分增加流水
        PointsLog log = new PointsLog();
        log.setUserId(acceptor.getId());
        log.setTaskId(taskId);
        log.setAmount(task.getPointsReward());
        log.setType("任务奖励");
        log.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(log);
    }
}*/
package com.help.service.impl;

import com.help.entity.PointsLog;
import com.help.entity.Task;
import com.help.entity.User;
import com.help.mapper.PointsLogMapper;
import com.help.mapper.TaskMapper;
import com.help.mapper.UserMapper;
import com.help.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PointsLogMapper pointsLogMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void acceptTask(Long taskId, Long studentId) {
        Task task = taskMapper.selectById(taskId);
        if (task == null || task.getStatus() != 1) {
            throw new RuntimeException("任务不存在或已被接受");
        }
        if (task.getPublisherId().equals(studentId)) {
            throw new RuntimeException("不能接受自己发布的任务");
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
            throw new RuntimeException("任务不存在或未处于进行中状态");
        }

        // 【安全加固建议】：实际项目中需要验证当前操作者是否是任务发布者
        // 如果将接口修改为 completeTask(Long taskId, Long currentUserId)，就可以这样校验：
        // if (!task.getPublisherId().equals(currentUserId)) {
        //     throw new RuntimeException("越权操作：只有发布者才能确认完成任务");
        // }

        // 1. 更新任务状态
        task.setStatus(3);
        taskMapper.updateById(task);

        // 2. 发放积分
        User acceptor = userMapper.selectById(task.getAcceptorId());
        acceptor.setPoints(acceptor.getPoints() + task.getPointsReward());
        userMapper.updateById(acceptor);

        // 3. 记录积分流水
        PointsLog log = new PointsLog();
        log.setUserId(acceptor.getId());
        log.setTaskId(taskId);
        log.setAmount(task.getPointsReward());
        log.setType("INCOME");
        log.setDescription("完成任务奖励");
        log.setCreatedAt(LocalDateTime.now());
        pointsLogMapper.insert(log);
    }
}