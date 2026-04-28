/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
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
      include: ['src/app/components/**/*.{ts,tsx}', 'src/app/pages/**/*.{ts,tsx}'], // 指定计算覆盖率的核心组件/页面目录
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/vite-env.d.ts'], // 排除不必要的文件
    },
  },
})