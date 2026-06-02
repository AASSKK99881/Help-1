/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
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
  // 👇 关键修改：新增本地开发代理
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 指向 Spring Boot 后端
        changeOrigin: true, // 允许跨域
      }
    }
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})