///<reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router'; 
import { StudentLogin } from '../app/pages/student/Login';
import { toast } from 'sonner';


const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));


const mockLogin = vi.fn();
vi.mock('../app/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
  })
}));



describe('Mock API 深度测试 - 验证页面在不同请求状态下的表现', () => {

  beforeEach(() => {

    vi.clearAllMocks(); 
  });

  it('1. [接口正常响应] API 请求成功时，应提示成功并跳转首页', async () => {

    mockLogin.mockResolvedValueOnce(true);

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/邮箱地址/i), { target: { value: 'success@edu.cn' } });
    fireEvent.change(screen.getByLabelText(/^密码$/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /立即登录/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('登录成功！');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('2. [异常处理场景] 必须包含：API 请求失败（如密码错误/网络中断）时，应拦截错误并提示用户', async () => {

    mockLogin.mockRejectedValueOnce(new Error('Unauthorized Access'));

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/邮箱地址/i), { target: { value: 'error@edu.cn' } });
    fireEvent.change(screen.getByLabelText(/^密码$/i), { target: { value: 'wrong_password' } });
    fireEvent.click(screen.getByRole('button', { name: /立即登录/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('登录失败，请检查账号或密码');

      expect(toast.success).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('3. [参数校验] 发起请求时，应将前端收集的账号、密码精确组装并提交给 API', async () => {
    mockLogin.mockResolvedValueOnce(true);

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/邮箱地址/i), { target: { value: 'special_user_99@edu.cn' } });
    fireEvent.change(screen.getByLabelText(/^密码$/i), { target: { value: 'ComplexP@ssw0rd' } });
    fireEvent.click(screen.getByRole('button', { name: /立即登录/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('special_user_99@edu.cn', 'ComplexP@ssw0rd', 'student');
    });
  });

  it('4. [极端异常捕获] 模拟后端崩溃返回非标准错误对象时，前端依然能防御性运行', async () => {
    mockLogin.mockRejectedValueOnce({ statusCode: 500, message: 'Server Internal Crash' });

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/邮箱地址/i), { target: { value: 'crash@edu.cn' } });
    fireEvent.change(screen.getByLabelText(/^密码$/i), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: /立即登录/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('登录失败，请检查账号或密码');
    });
  });
});