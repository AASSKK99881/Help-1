# AI 功能集成说明

## 1. 功能概述
本项目集成了一项名为 **“AI 页面导览（页面智能概括）”** 的智能辅助功能。
当用户在系统中浏览不同页面（如“任务大厅”、“个人中心”等）时，点击页面右下角的“✨ AI 页面导览”悬浮按钮，系统会调用 AI 大语言模型，结合用户当前所处的页面上下文，自动生成一小段（约50字左右）友好的新手引导文案，向用户概括该页面的主要功能和可进行的操作。

## 2. 使用的模型
* **模型提供商**：DeepSeek
* **使用模型**：`deepseek-chat` (DeepSeek-V3)
* **调用方式**：通过云端 API 发起 HTTP RESTful 请求调用。

## 3. 实现细节与安全性
### 3.1 提示词设计 (Prompt Engineering)
后端在接收到前端传来的页面名称（`pageContext`）后，动态拼接 System Prompt：
> "你是一个校园积分互助平台的新手引导助手。用户现在正在访问【{{pageContext}}】页面。请用一小段话（50字左右）友好地向用户概括这个页面的主要功能和可以进行的操作。"

### 3.2 后端 API 封装
* 后端新增了 `AiController` 控制器，并对外暴露了独立的 API 端点：`POST /api/ai/summary`。
* 业务逻辑层 (`AiServiceImpl`) 使用了 Spring Boot 的 `RestTemplate` 封装对 DeepSeek API 的 HTTP POST 请求，并解析返回的 JSON 数据，提取出助手的回复文本。

### 3.3 密钥安全管理 (Security)
为了保证 API 密钥的安全性并符合代码提交规范，本项目**没有**将 API Key 提交到代码仓库。
* API Key 及相关配置项被抽取到了 `application.properties` 中。
* 密钥的具体值通过服务器系统的环境变量 `${AI_API_KEY}` 进行动态注入，确保了线上运行环境与代码仓库的物理隔离。

## 4. API 接口规范
**请求路径**: `POST /api/ai/summary`

**请求体 (Request)**:
```json
{
  "pageContext": "任务大厅"
}

**响应体 (Response)**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "summary": "欢迎来到任务大厅！在这里，您可以浏览全校同学发布的各类互助任务。您可以根据自己的特长接取任务赚取积分，或者发布您需要帮助的任务。"
    }
}