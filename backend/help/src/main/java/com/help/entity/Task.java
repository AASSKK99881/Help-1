package com.help.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("tasks")
public class Task {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long publisherId;
    private Long acceptorId;
    private String category;
    private String title;
    private String description;
    private Integer pointsReward;
    private Integer status; // 0待审, 1待接, 2进行中, 3完成
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
}