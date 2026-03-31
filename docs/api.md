# 校园互助系统 (Help System) 详细 API 接口文档

## 1. 概述
本文档详细定义了校园互助系统前后端分离架构下的 API 交互规范。API 设计严格遵循 RESTful 架构风格，采用 JSON 格式进行数据序列化交互。

### 1.1 基础请求信息
- **Base URL**: `http://localhost:8080/api`
- **协议**: HTTP/1.1 或 HTTP/2
- **数据交互格式**: `application/json; charset=utf-8`

### 1.2 认证与鉴权机制
系统采用 **JWT (JSON Web Token)** 进行无状态认证。
- 除登录 (`/users/login`) 和注册 (`/users/register`) 接口外，其余所有接口均需要在 HTTP Header 中携带 Token。
- **Header 格式**: `Authorization: Bearer <Your_JWT_Token>`

### 1.3 统一响应封装 (Result<T>)
所有接口的返回数据均被封装在统一的 JSON 对象中，格式如下：

    {
      "code": 200,      // 业务状态码：200为成功，其余为失败
      "msg": "操作成功", // 面向用户的提示信息或错误描述
      "data": {}        // 具体返回的数据承载对象，可能为 Object、Array 或 null
    }

---

## 2. 用户模块 API (User Module)

### 2.1 用户注册
- **接口路径**: `/users/register`
- **请求方法**: `POST`
- **接口说明**: 供新学生用户注册系统账号。
- **请求头 (Headers)**: `Content-Type: application/json`
- **请求体 (Request Body)**:

    {
      "username": "student_01",    // 必填项，String，长度 4-20
      "password": "password123",   // 必填项，String，长度 6-20
      "role": 1                    // 必填项，Integer，1代表学生，2代表管理员
    }

- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "注册成功",
      "data": {
        "id": 1001,
        "username": "student_01",
        "createdAt": "2026-03-31T10:00:00"
      }
    }

- **失败响应示例 (400 Bad Request)**:

    {
      "code": 400,
      "msg": "用户名已存在",
      "data": null
    }

### 2.2 用户登录
- **接口路径**: `/users/login`
- **请求方法**: `POST`
- **接口说明**: 验证用户凭证并下发 JWT Token。
- **请求体 (Request Body)**:

    {
      "username": "student_01",
      "password": "password123"
    }

- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "登录成功",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR...", // 下发的 JWT
        "user": {
          "id": 1001,
          "username": "student_01",
          "points": 100,                     // 当前可用积分
          "role": 1
        }
      }
    }

---

## 3. 任务核心业务 API (Task CRUD)

### 3.1 分页查询任务大厅列表
- **接口路径**: `/tasks`
- **请求方法**: `GET`
- **接口说明**: 获取互助任务列表，支持分页和多维度筛选。按发布时间倒序排列。
- **查询参数 (Query Parameters)**:
  - `page` (Integer, 可选): 当前页码，默认 `1`
  - `size` (Integer, 可选): 每页条数，默认 `10`
  - `category` (String, 可选): 任务分类筛选，如 `跑腿`, `辅导`, `维修`
  - `status` (Integer, 可选): 0待审, 1待接, 2进行中, 3完成
- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "查询成功",
      "data": {
        "total": 150,       // 总记录数
        "totalPages": 15,   // 总页数
        "page": 1,
        "size": 10,
        "items": [
          {
            "id": 1,
            "publisherId": 1001,
            "category": "取快递",
            "title": "帮忙去南区拿个快递",
            "pointsReward": 5,
            "status": 1,
            "deadline": "2026-04-01T18:00:00",
            "createdAt": "2026-03-31T10:00:00"
          }
        ]
      }
    }

### 3.2 发布新任务
- **接口路径**: `/tasks`
- **请求方法**: `POST`
- **接口说明**: 学生发布一个新的互助任务，发布时将暂时冻结对应积分。
- **请求体 (Request Body)**:

    {
      "title": "帮忙去南区拿个快递",         // 必填，String，限制 50 字符内
      "category": "取快递",                  // 必填，String
      "description": "件不大，大概1kg，送到3栋楼下。", // 选填，String
      "pointsReward": 5,                     // 必填，Integer，必须大于 0 且小于等于用户当前余额
      "deadline": "2026-04-01T18:00:00"      // 必填，DateTime
    }

- **成功响应 (201 Created)**:

    {
      "code": 201,
      "msg": "任务发布成功，等待审核",
      "data": { "id": 1, "status": 0 }
    }

### 3.3 获取任务详情
- **接口路径**: `/tasks/{id}`
- **请求方法**: `GET`
- **路径参数**: `id` (Long, 必填) - 任务的主键 ID
- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "成功",
      "data": {
        "id": 1,
        "publisherId": 1001,
        "acceptorId": null,
        "category": "取快递",
        "title": "帮忙去南区拿个快递",
        "description": "件不大，大概1kg，送到3栋楼下。",
        "pointsReward": 5,
        "status": 1,
        "deadline": "2026-04-01T18:00:00",
        "createdAt": "2026-03-31T12:00:00"
      }
    }

### 3.4 修改任务信息
- **接口路径**: `/tasks/{id}`
- **请求方法**: `PUT`
- **接口说明**: 修改任务信息。**限制条件**：只有任务发布者本人可修改，且任务状态必须为 `待接(1)` 或 `待审(0)`。
- **请求体 (Request Body)** (支持局部更新):

    {
      "description": "更新：包裹有2kg，送到3栋502。",
      "pointsReward": 8 // 如果增加积分，需校验余额是否充足
    }

### 3.5 删除/撤销任务
- **接口路径**: `/tasks/{id}`
- **请求方法**: `DELETE`
- **接口说明**: 撤销并删除已发布的任务。**限制条件**：仅发布者或管理员可删，删除后解冻积分。
- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "任务已撤销，积分已退回",
      "data": null
    }

---

## 4. 业务动作与流程 API (Task Actions)

### 4.1 学生接单
- **接口路径**: `/tasks/{id}/accept`
- **请求方法**: `POST`
- **接口说明**: 学生接取指定的互助任务。**校验规则**：不能接取自己发布的任务；任务状态必须为 `1(待接)`。
- **路径参数**: `id` (Long, 必填) - 任务ID
- **查询参数**: `studentId` (Long, 必填) - 接单学生的ID (实际项目中建议直接从 JWT Token 解析，本处为了作业演示通过传参处理)
- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "接单成功！任务已进入进行中状态",
      "data": null
    }

- **失败响应示例 (403 Forbidden)**:

    {
      "code": 403,
      "msg": "无法接取自己发布的任务",
      "data": null
    }

### 4.2 任务完成与积分划转
- **接口路径**: `/tasks/{id}/complete`
- **请求方法**: `POST`
- **接口说明**: 确认任务完成。此接口会触发事务操作：将任务状态变更为 `3(完成)`，并将冻结的积分打入接单者的账户中。
- **路径参数**: `id` (Long, 必填) - 任务ID
- **成功响应 (200 OK)**:

    {
      "code": 200,
      "msg": "任务已完成，积分已划转！",
      "data": null
    }

---

## 5. 全局状态码字典 (Error Codes)

| 业务状态码 (code) | 含义说明 | 处理建议 |
| ---------------- | -------- | -------- |
| `200` | 请求成功 | 正常处理业务逻辑 |
| `201` | 资源创建成功 | 通常用于 POST 新增资源 |
| `400` | 参数校验失败 | 检查必填项、字段类型或长度是否符合规范 |
| `401` | 未授权 / Token 失效 | 前端需清除本地 Token，跳转至登录页面重新登录 |
| `403` | 权限不足 | 用户试图操作不属于自己的资源（如修改别人的任务） |
| `404` | 资源不存在 | 请求的 Task ID 或 User ID 在数据库中找不到 |
| `500` | 服务器内部异常 | 后端代码抛出未捕获的异常，需联系后端研发排查日志 |