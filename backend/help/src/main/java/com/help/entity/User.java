package com.help.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user") // ⚠️ 必须改为单数 user，与数据库真实表名保持一致
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String username; // 用于存学号 (studentId)

    // 👇 新增：用于接收前端传来的真实姓名和邮箱
    private String name;
    private String email;
    private String phone;

    @JsonIgnore
    private String password;
    private Integer role;
    private Integer points;
    private Integer creditScore;
    private Integer status; // 0正常, 1封禁
    private LocalDateTime createdAt;
}