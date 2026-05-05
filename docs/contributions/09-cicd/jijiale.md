# CI/CD 配置贡献说明

姓名：纪嘉乐 学号：2312190109 角色：前端 日期：2026-05-05

## 完成的工作
### 工作流相关
- [✔] 参与编写/审查 `.github/workflows/ci.yml`
- [✔] 配置 Codecov 覆盖率上传(backend/frontend flag)
- [✔] 添加 README 状态徽章

### 代码适配
- [✔] 本地测试命令与CI一致，无需额外配置
- [✔] 代码通过Lint 检查(ESLint)
- [✔] 核心覆盖率达标(>60%)

## PR 链接
- PR #X: https://github.com/AASSKK99881/Help-1/pull/38

## CI 运行链接
- https://github.com/AASSKK99881/Help-1/actions/runs/25363323642/job/74367841149

## 遇到的问题和解决
1. 问题：CI 环境下 ESLint 找不到配置文件，且默认无法识别 TypeScript 文件导致检查失败。 
   解决：在本地环境锁定了稳定的 ESLint v8 版本，新增了包含 TypeScript 支持的 `.eslintrc.cjs` 配置，并在 `package.json` 的 lint 脚本中加入 `--ext .ts,.tsx,.js,.jsx` 参数确保全量扫描。
2. 问题：CI 服务器为非交互式环境，默认测试命令会导致流水线卡死挂起。
   解决：在 `package.json` 中配置了 `vitest run --coverage`，强制去除了 watch 模式，确保在流水线中单次运行并顺利生成 `lcov.info` 覆盖率报告。
3. 问题：GitHub Actions 找不到前端的 package-lock.json 文件，导致依赖缓存失败报错。
   解决：在 `ci.yml` 的 setup-node 步骤中明确增加了 `cache-dependency-path: 'frontend/package-lock.json'` 配置，帮助流水线精准定位前端缓存路径。

## 心得体会
通过本次 CI/CD 工作流的协作配置，我掌握了如何将前端的自动化测试（Vitest）与代码规范检查（ESLint）无缝接入 GitHub Actions 流水线。在解决本地与 CI 环境差异的过程中，我深刻体会到了持续集成对于规范团队代码、保障交付质量的重大意义，也进一步提升了对前端工程化的实际动手能力。