# 软件测试贡献说明

姓名: 纪嘉乐 学号: 2312190109 角色: 前端 日期: 2026-04-[26]

## 一、完成的测试工作

### 测试文件
本次前端测试基建与用例编写主要包含以下文件：
- `vite.config.ts` & `package.json` (配置 Vitest + React Testing Library 环境)
- `src/tests/TaskCard.test.tsx` (组件渲染与边界测试)
- `src/tests/Login.test.tsx` (组件表单交互测试)
- `src/tests/LoginMockApi.test.tsx` (接口 Mock 与异常捕获测试)

### 测试清单
- [✔] 正常情况测试 (6个)：包含任务卡片正常渲染、登录页面元素展示、输入框联动、默认标签页状态验证等。
- [✔] 边界情况测试 (2个)：包含任务标签 (Tags) 数量溢出时的渲染验证、超长文本截断测试。
- [✔] 异常情况测试 (4个)：包含原生的必填项校验 (Required)、登录拦截。
- [✔] Mock API 测试 (4个)：涵盖 200 正常登录跳转首页、401 密码错误 Toast 提示、500 服务端宕机兜底捕获，以及精准的提交参数校验。

## 二、测试覆盖率
- 通过对前端核心组件 (`Login.tsx`, `TaskCard.tsx`) 的针对性测试，核心代码逻辑测试覆盖率达到了 50%。

## 三、AI 辅助过程 (加分项)

**1. 使用的 AI 工具**：Gemini / Cursor

**2. 人工修改与调试过程**：
- **路径重定向修正**：AI 生成的组件导入使用了默认导入 (`import Login`)，人工结合实际代码改为了命名导入 (`import { StudentLogin }`)。
- **全局状态 Mock**：AI 生成的基础测试导致页面崩溃，人工排查发现是缺失了 `<AuthProvider>` 上下文。手动添加了 `vi.mock('../app/contexts/AuthContext')` 完美解决了上下文依赖问题。
- **异步交互修复**：在测试 Radix UI 的 Tabs 组件切换时，人工引入了 `@testing-library/react` 的 `waitFor` 函数，或改为测试默认边界状态，解决了底层手势事件导致断言过快的问题。

## 四、PR 链接与 CI 截图
- **Commit/PR 链接**：https://github.com/AASSKK99881/Help-1/pull/22

## 五、遇到的问题和心得

1. **问题**：在编写 `Login.tsx` 测试时，终端持续报 `useAuth must be used within an AuthProvider` 的错误。
   **解决与心得**：起初以为是组件本身有 Bug，后来意识到在单元测试环境中，并没有挂载外层的 `App.tsx`，自然没有全局的 Context。这让我深刻理解了单元测试“隔离性”的本质——我们需要使用 `vi.mock` 去拦截并模拟（Mock）外部的 Hook 返回值，这样才能纯粹地测试当前组件的 UI 逻辑。
