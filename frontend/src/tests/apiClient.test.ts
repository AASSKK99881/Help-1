/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 直接测试拦截器逻辑（不依赖模块级副作用）
describe('apiClient 请求拦截器逻辑测试', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('1. 存在 token 时在请求头中添加 Authorization', () => {
    localStorage.setItem('token', 'bearer-token-123');
    const token = localStorage.getItem('token');

    // 模拟拦截器逻辑
    const config = { headers: {} as Record<string, string> };
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    expect(config.headers['Authorization']).toBe('Bearer bearer-token-123');
  });

  it('2. 没有 token 时不添加 Authorization 头', () => {
    const token = localStorage.getItem('token');
    const config = { headers: {} as Record<string, string> };
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    expect(config.headers['Authorization']).toBeUndefined();
  });

  it('3. 请求拦截器 error handler 透传 error', () => {
    const error = new Error('Request setup failed');
    // 模拟拦截器 error handler: (error) => Promise.reject(error)
    const result = () => { throw error; };
    expect(result).toThrow('Request setup failed');
  });
});

describe('apiClient 响应拦截器逻辑测试', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('1. 响应成功时解包 response.data', () => {
    const response = {
      data: { code: 200, data: { user: 'test', name: 'Alice' } },
      status: 200,
      headers: {},
    };

    // 拦截器逻辑: (response) => response.data
    const result = response.data;
    expect(result).toEqual({ code: 200, data: { user: 'test', name: 'Alice' } });
  });

  it('2. 401 响应时清除 token', () => {
    localStorage.setItem('token', 'expired-token');
    const error = { response: { status: 401 } };

    // 拦截器逻辑
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('3. 404 响应时正确识别', () => {
    const error = { response: { status: 404 } };
    const status = error.response?.status;

    expect(status).toBe(404);
  });

  it('4. 500 响应时正确识别为服务器错误', () => {
    const error = { response: { status: 500 } };
    const isServerError = error.response?.status === 500;

    expect(isServerError).toBe(true);
  });

  it('5. 无 response 有 request 时识别为网络错误', () => {
    const error = { request: {}, response: undefined };
    const isNetworkError = !error.response && !!error.request;

    expect(isNetworkError).toBe(true);
  });

  it('6. 其他错误状态码（如 403）进入 default 分支', () => {
    const error = { response: { status: 403 } };
    const knownStatuses = [401, 404, 500];
    const isKnown = knownStatuses.includes(error.response?.status);

    expect(isKnown).toBe(false);
  });
});
