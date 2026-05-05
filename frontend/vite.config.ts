/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // 新增的 Vitest 测试配置
  test: {
    environment: 'jsdom', // 模拟浏览器环境
    globals: true, // 允许在测试文件中直接使用 describe, it, expect 等全局变量
    setupFiles: './src/setupTests.ts', // 测试前置执行文件
    coverage: {
      provider: 'v8', // 覆盖率提供者
      reporter: ['text', 'lcov'], // 终端输出文本，lcov 用于 Codecov 上传
      include: [
        'src/app/components/**/*.{ts,tsx}', 
        'src/app/pages/**/*.{ts,tsx}'
      ], // 指定计算覆盖率的核心组件/页面目录
      exclude: [
        'src/**/*.test.{ts,tsx}', 
        'src/main.tsx', 
        'src/vite-env.d.ts',
        'src/app/routes.tsx',              // 排除路由配置文件
        'src/app/components/ui/**',        // 排除所有的基础 UI 组件 (数量庞大，最拉低覆盖率的部分)
        'src/app/components/figma/**'      // 排除 Figma 自动生成的组件
      ], // 排除不必要的文件，防止拉低覆盖率
    },
  },
})