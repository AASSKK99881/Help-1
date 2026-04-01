// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

// 引入 Mock 启动函数
async function enableMocking() {
  // 使用 as any 绕过 TypeScript 对 Vite 环境变量的报错
  if (!(import.meta as any).env.DEV) {
    return;
  }
  const { worker } = await import('./mocks/browser');
  // 启动 service worker
  return worker.start({
    onUnhandledRequest: 'bypass', // 对没有写 mock 的请求直接放行，不报红
  });
}

// 确保 Mock 启动后再渲染页面
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});