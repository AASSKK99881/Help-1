# API设计与实现贡献说明

姓名: 纪嘉乐
学号: 2312190109
日期: 2026-03-31

## 我完成的工作
- [x] HTTP客户端配置
- [x] API调用函数封装
- [x] Mock数据配置


## PR 链接
- PR [#X: https://github.com/xxx/xxx/pull/X (填入你们团队在 GitHub 上的 Pull Request 链接)](https://github.com/AASSKK99881/Help-1/pull/11)

## 遇到的问题和解决
1. 问题: 启动 MSW 时 Vite 环境变量类型报错 (Property 'env' does not exist on type 'ImportMeta')。
   解决: 在 `src` 目录下新建 `vite-env.d.ts` 文件，引入 Vite 客户端类型声明 `/// <reference types="vite/client" />`，成功解决了 TypeScript 类型检查报错。
2. 问题: 首次启动 MSW 时报 404，找不到 `mockServiceWorker.js`。
   解决: 确认了 Vite 项目的根目录位置，进入正确的目录后重新执行 `npx msw init public/ --save` 生成核心文件解决。

## 心得体会
通过本次“API设计与实现”的作业，我深刻体会到了前后端建立协作契约的重要性。我主要负责了前端 API 访问层的搭建，掌握了如何使用 Axios 封装统一的 HTTP 客户端以及配置请求拦截器携带 Token。特别是在后端接口尚未完成时，我学会了利用 MSW (Mock Service Worker) 在前端独立进行数据拦截和模拟，这不仅没有阻塞前端的开发进度，反而大大提高了前后端分离模式下的开发效率。