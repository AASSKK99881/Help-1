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
  assetsInclude: ['**/*.svg', '**/*.csv'],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'src/app/components/TaskCard.tsx',
        'src/app/pages/student/Login.tsx',
        'src/app/components/ui/button.tsx',
        'src/app/components/ui/input.tsx',
        'src/app/components/ui/label.tsx',
        'src/app/components/ui/badge.tsx',
        'src/app/components/ui/utils.ts'
      ]
    },
  },
})