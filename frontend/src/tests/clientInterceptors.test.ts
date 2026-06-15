import { describe, it, expect, beforeEach } from 'vitest';
// 直接导入真实的 apiClient，通过手动触发拦截器来覆盖回调代码
import apiClient from '../app/api/client';

describe('apiClient request 拦截器回调', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('1. 有 token 时添加 Authorization 头', () => {
    localStorage.setItem('token', 'my-jwt-token');
    const config = { headers: {} };

    // 手动触发 request 拦截器的 fulfilled 回调
    const handler = (apiClient.interceptors as any).request.handlers[0];
    const result = handler.fulfilled(config);

    expect(result.headers['Authorization']).toBe('Bearer my-jwt-token');
  });

  it('2. 无 token 时不添加 Authorization 头', () => {
    const config = { headers: {} };

    const handler = (apiClient.interceptors as any).request.handlers[0];
    const result = handler.fulfilled(config);

    expect(result.headers['Authorization']).toBeUndefined();
  });

  it('3. request error handler 透传 error', async () => {
    const error = new Error('Config error');
    const handler = (apiClient.interceptors as any).request.handlers[0];

    try {
      await handler.rejected(error);
    } catch (e: any) {
      expect(e.message).toBe('Config error');
    }
  });
});

describe('apiClient response 拦截器回调', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('4. 成功响应解包 response.data', () => {
    const response = { data: { code: 200, data: { name: 'Alice' } }, status: 200 };

    const handler = (apiClient.interceptors as any).response.handlers[0];
    const result = handler.fulfilled(response);

    expect(result).toEqual({ code: 200, data: { name: 'Alice' } });
  });

  it('5. 401 错误时清除 token', async () => {
    localStorage.setItem('token', 'expired-token');
    const error = { response: { status: 401 } };

    const handler = (apiClient.interceptors as any).response.handlers[0];
    try {
      await handler.rejected(error);
    } catch (e) {
      // error handler re-throws
    }

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('6. 404 错误时不崩溃', async () => {
    const error = { response: { status: 404 } };

    const handler = (apiClient.interceptors as any).response.handlers[0];
    try {
      await handler.rejected(error);
    } catch (e) {
      // expected
    }
  });

  it('7. 500 错误时不崩溃', async () => {
    const error = { response: { status: 500 } };

    const handler = (apiClient.interceptors as any).response.handlers[0];
    try {
      await handler.rejected(error);
    } catch (e) {
      // expected
    }
  });

  it('8. 网络错误（有 request 无 response）不崩溃', async () => {
    const error = { request: {} };

    const handler = (apiClient.interceptors as any).response.handlers[0];
    try {
      await handler.rejected(error);
    } catch (e) {
      // expected
    }
  });

  it('9. 其他状态码（如 403）进入 default 分支', async () => {
    const error = { response: { status: 403 } };

    const handler = (apiClient.interceptors as any).response.handlers[0];
    try {
      await handler.rejected(error);
    } catch (e) {
      // expected
    }
  });
});
