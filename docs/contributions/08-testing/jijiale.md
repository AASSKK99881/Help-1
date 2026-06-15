# 软件测试贡献说明

姓名: 纪嘉乐 学号: 2312190109 角色: 前端 日期: 2026-04-23

## 一、完成的测试工作

### 测试文件

本次前端测试共编写 **17 个测试文件**，覆盖 **111 个测试用例**：

**组件渲染 / 交互测试（9 个文件，45 个测试用例）：**

| 文件 | 测试数 | 覆盖内容 |
|------|--------|----------|
| `src/tests/TaskCard.test.tsx` | 3 | 任务卡片渲染、多标签渲染、点击导航回调 |
| `src/tests/TaskStatusBadge.test.tsx` | 4 | 四种状态（待接取/进行中/已完成/未知）的样式渲染 |
| `src/tests/PointsBadge.test.tsx` | 3 | 积分显示、自定义 className、零积分渲染 |
| `src/tests/Login.test.tsx` | 5 | 登录页面渲染、输入框联动、默认标签页、必填属性、管理员链接 |
| `src/tests/Register.test.tsx` | 9 | 注册表单渲染/交互/校验、注册 API Mock |
| `src/tests/Messages.test.tsx` | 5 | 页面标题、空状态提示、Tab 切换 |
| `src/tests/Settings.test.tsx` | 6 | 密码表单渲染、输入联动、密码校验、返回导航、必填属性 |
| `src/tests/CreateTask.test.tsx` | 12 | 表单渲染/字数计数、积分校验、审核通过/审核中 Mock |

**Mock API 测试（6 个文件，39 个测试用例）：**

| 文件 | 测试数 | 覆盖场景 |
|------|--------|----------|
| `src/tests/LoginMockApi.test.tsx` | 4 | 登录成功跳转、失败提示、参数传递、异常兜底 |
| `src/tests/SettingsMockApi.test.tsx` | 3 | 修改密码成功/失败、提交中按钮状态 |
| `src/tests/PointsHistoryMockApi.test.tsx` | 5 | 加载态、数据渲染、空列表、API 失败、收支统计 |
| `src/tests/ProfileMockApi.test.tsx` | 4 | 编辑资料成功/失败、弹窗交互、用户信息渲染 |
| `src/tests/MyTasksMockApi.test.tsx` | 7 | 加载态、已发布/已接取、空引导、完成/取消确认 |
| `src/tests/ActivitiesMockApi.test.tsx` | 8 | 加载态、活动列表、报名成功/失败、报名后状态 |

**API 模块 / 拦截器直接测试（2 个文件，24 个测试用例）：**

| 文件 | 测试数 | 覆盖内容 |
|------|--------|----------|
| `src/tests/apiDirect.test.ts` | 15 | authApi/tasksApi/userApi/activitiesApi 各方法调用验证 |
| `src/tests/clientInterceptors.test.ts` | 9 | request 拦截器(Authorization)、response 拦截器(解包/401/404/500/网络错误) |

### 测试清单

- [x] 正常情况测试（28 个）：组件正确渲染、表单输入联动、API 成功响应等
- [x] 边界 / 异常情况测试（18 个）：空数据状态、密码校验、必填属性、积分不足等
- [x] Mock 使用（39 个）：Mock AuthContext、API 模块、toast、useNavigate 等外部依赖
- [x] 失败场景覆盖（12 个）：API 401/500 错误、网络中断、非标准错误对象兜底

### 测试分类统计

| 测试类型 | 最低要求 | 实际数量 | 状态 |
|----------|----------|----------|------|
| 组件渲染 / 交互测试 | ≥ 8 | **45** | ✅ 超额完成 |
| Mock API 测试（含失败场景） | ≥ 4 | **39** | ✅ 超额完成 |
| API 模块 / 拦截器测试 | - | **24** | ✅ |
| 测试文件总数 | - | **17** | - |
| 测试用例总数 | - | **111** | 全部通过 |

## 二、测试覆盖率

```
Statements   : 83.47% ( 303/363 )
Branches     : 68.75% ( 121/176 )
Functions    : 74.28% ( 130/175 )
Lines        : 85.01% ( 295/347 )
```

**核心组件覆盖率：**

| 组件 / 模块 | 语句覆盖率 |
|-------------|-----------|
| TaskCard.tsx | 80% |
| TaskStatusBadge.tsx | 100% |
| PointsBadge.tsx | 100% |
| Login.tsx | 91.89% |
| CreateTask.tsx | 89.65% |
| PointsHistory.tsx | 86.95% |
| Activities.tsx | 100% |
| MyTasks.tsx | 82.14% |
| Profile.tsx | 76.92% |
| api/client.ts (拦截器) | 100% |
| api/tasks.ts | 66.66% |
| **核心模块平均** | **> 85%** |

远超 50% 覆盖率要求，达到 **83.47% 语句覆盖率**。

## 三、AI 辅助过程（加分项）

**1. 使用的 AI 工具**：Claude Code（Anthropic）

**2. Prompt 示例：**

```
我现在要完善我help-1大作业项目的收尾,我需要完成对于项目的软件覆盖度测试
要求：
- 组件渲染/交互测试 ≥ 8 个
- Mock API 测试 ≥ 4 个
- 核心组件覆盖率 > 50%
```

**3. AI 生成 + 人工修改的测试数量：36 个**

AI 辅助完成了以下工作：
- 自动探索项目结构，识别现有测试和未覆盖的组件
- 根据项目现有的 Mock 模式生成风格一致的测试代码
- 自动运行测试并诊断失败原因

**4. 人工修改与调试过程：**
- **错误信息对齐**：AI 生成的测试中错误提示写的是"邮箱或密码"，实际代码使用"账号或密码"（因为登录输入框 label 是"学号/邮箱地址"），手动修正了 2 处断言
- **Radix Tabs 交互**：`fireEvent.click` 无法触发 Radix UI Tabs 的切换事件，改用 `@testing-library/user-event` 的 `userEvent.click` 解决了此问题
- **重复文本匹配**：PointsHistory 测试中 `-20` 同时出现在统计面板和流水明细中，改用 `getAllByText` 并验证数量为 2
- **累计支出符号**：组件渲染 `-{totalExpense}`，`totalExpense` 本身已取绝对值，但显示时加了负号前缀，初始断言查找 `20` 改为查找 `-20`

## 四、PR 链接与 CI 截图

- **Commit/PR 链接**：https://github.com/AASSKK99881/Help-1/pull/22
- **CI 工作流**：`.github/workflows/ci.yml`（前端 job 已配置 `npm test --coverage` + Codecov 上传）

## 五、遇到的问题和解决

1. **问题**：在编写 `Login.tsx` 测试时，终端报 `useAuth must be used within an AuthProvider` 错误。
   **解决**：使用 `vi.mock('../app/contexts/AuthContext')` 拦截并模拟 useAuth Hook 的返回值，保证单元测试的隔离性。

2. **问题**：Radix UI Tabs 组件使用 `fireEvent.click` 无法切换标签页。
   **解决**：改用 `@testing-library/user-event` 的 `userEvent.click`，因为 Radix 的 TabsTrigger 内部使用了更底层的事件处理。

3. **问题**：PointsHistory 测试中 `getByText('-20')` 报找到多个元素。
   **解决**：`-20` 同时出现在统计面板和流水明细条目中，改用 `getAllByText` 加数量断言。

4. **问题**：错误提示文本不一致导致测试失败（"邮箱或密码" vs "账号或密码"）。
   **解决**：以实际 UI 代码为准，统一使用"账号或密码"。

## 六、心得体会

本次测试工作让我深刻理解了前端测试的分层策略：
- **组件测试**关注用户视角（渲染输出、交互行为），不测试实现细节
- **Mock API 测试**验证组件在不同网络状态下的表现（加载中、成功、失败、空数据）
- **测试隔离性**是核心原则——通过 Mock 切断对外部依赖（Context、API、路由），让每个测试纯粹地验证目标行为

Radix UI / shadcn/ui 组件库的事件机制与原生 DOM 有差异，需要配合 `@testing-library/user-event` 使用才能可靠触发交互。同时，静态类型检查（TypeScript）和测试是互补的质量保障手段，二者结合能有效提高代码的可维护性。
