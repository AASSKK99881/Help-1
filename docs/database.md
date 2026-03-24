# 校园学生积分互助网站 - 数据库设计文档

## 1. 核心实体关系图 (ER 图)

根据系统需求，我们抽取了三个核心业务实体：**用户 (Users)**、**互助委托 (Tasks)** 和 **积分流水 (Points_Logs)**。
系统的核心业务逻辑围绕积分流转展开，必须保证积分变更的数据一致性与可追溯性。


##  2. 核心数据表设计
本系统主要使用 MySQL 8.0 作为关系型数据库存储核心业务数据。以下为三大核心表的详细设计：

### 2.1 用户表 (`users`)

| 字段名 | 数据类型 | 约束 | 描述说明 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 用户唯一标识 |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | 学号(学生)或工号(教师) |
| `password` | VARCHAR(255) | NOT NULL | BCrypt 加密后的密码 |
| `role` | TINYINT | NOT NULL, DEFAULT 0 | 角色权限：0-学生端，1-教师管理端 |
| `points` | INT | NOT NULL, DEFAULT 0 | 账户可用积分余额 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 账号注册创建时间 |

### 2.2 互助委托表 (`tasks`)

| 字段名 | 数据类型 | 约束 | 描述说明 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 委托业务流水号 |
| `publisher_id` | BIGINT | NOT NULL, INDEX | 发布人ID (关联 users.id) |
| `acceptor_id` | BIGINT | NULL | 接单人ID (关联 users.id) |
| `category` | VARCHAR(50) | NOT NULL | 需求分类(如：跑腿、辅导等) |
| `title` | VARCHAR(100) | NOT NULL | 互助需求标题 |
| `description`| TEXT | NULL | 需求详细描述 |
| `points_reward`| INT | NOT NULL | 悬赏积分数额 |
| `status` | TINYINT | NOT NULL, DEFAULT 0 | 状态：0-待审核, 1-待接单, 2-进行中, 3-已完成, 4-已取消/驳回 |
| `deadline` | DATETIME | NOT NULL | 需求有效截止时间 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 需求发布时间 |

### 2.3 积分流水表 (`points_logs`)

| 字段名 | 数据类型 | 约束 | 描述说明 |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 流水记录主键 |
| `user_id` | BIGINT | NOT NULL, INDEX | 积分变动的所属用户ID |
| `task_id` | BIGINT | NULL | 产生流水的关联委托ID |
| `amount` | INT | NOT NULL | 积分变动数额（正数代表增加，负数代表扣除）|
| `type` | VARCHAR(50) | NOT NULL | 变动类型(如：悬赏冻结、任务奖励、违约扣除、系统调整) |
| `description`| VARCHAR(255)| NULL | 具体的备注说明或调整原因 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 流水产生时间 |

## 3. 数据库建表脚本 (Migration SQL)
为了方便团队协作和不同环境（开发、测试、生产）的快速初始化，提供以下建表脚本（支持 Flyway/Liquibase 等 Migration 工具执行）：
-- V1.0.1__Create_Users_Table.sql
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) NOT NULL COMMENT '学号/工号(实名制)',
  `password` varchar(255) NOT NULL COMMENT '加密密码',
  `role` tinyint NOT NULL DEFAULT '0' COMMENT '角色: 0-学生, 1-管理端教师',
  `points` int NOT NULL DEFAULT '0' COMMENT '账户积分余额',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基本信息表';

-- V1.0.2__Create_Tasks_Table.sql
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '委托流水号',
  `publisher_id` bigint NOT NULL COMMENT '发布人用户ID',
  `acceptor_id` bigint DEFAULT NULL COMMENT '接单人用户ID',
  `category` varchar(50) NOT NULL COMMENT '需求分类',
  `title` varchar(100) NOT NULL COMMENT '需求标题',
  `description` text COMMENT '详细描述',
  `points_reward` int NOT NULL COMMENT '悬赏积分额度',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态: 0-待审核, 1-待接单, 2-进行中, 3-已完成, 4-已取消/驳回',
  `deadline` datetime NOT NULL COMMENT '截止时间',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  PRIMARY KEY (`id`),
  KEY `idx_publisher` (`publisher_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生互助需求主表';

-- V1.0.3__Create_Points_Logs_Table.sql
CREATE TABLE `points_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '账户所有者ID',
  `task_id` bigint DEFAULT NULL COMMENT '关联的委托ID(如果有)',
  `amount` int NOT NULL COMMENT '积分变动值(正数增加,负数扣除)',
  `type` varchar(50) NOT NULL COMMENT '业务类型(如:悬赏扣除/接单奖励/违约惩罚/系统调整)',
  `description` varchar(255) DEFAULT NULL COMMENT '变动说明/备注',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '发生时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户积分变动流水明细表';