/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { StudentLogin } from '../app/pages/student/Login';
import { toast } from 'sonner';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../app/contexts/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn(), isAuthenticated: false, user: null })
}));

const mockRegister = vi.fn();
vi.mock('../app/api/auth', () => ({
  authApi: { register: (...args: any[]) => mockRegister(...args), login: vi.fn(), logout: vi.fn() }
}));

describe('Register 注册表单组件交互测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const switchToRegister = async () => {
    await userEvent.click(screen.getByRole('tab', { name: /注册/ }));
  };

  it('1. 切换到注册标签页后显示注册表单字段', async () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await switchToRegister();

    expect(screen.getByLabelText('姓名')).toBeInTheDocument();
    expect(screen.getByLabelText('学号')).toBeInTheDocument();
    expect(screen.getByLabelText('邮箱地址')).toBeInTheDocument();
    expect(screen.getByLabelText('设置密码')).toBeInTheDocument();
    expect(screen.getByLabelText('确认密码')).toBeInTheDocument();
  });

  it('2. 注册表单输入框值随用户输入正确更新', async () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await switchToRegister();

    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '张三' } });
    fireEvent.change(screen.getByLabelText('学号'), { target: { value: '2024001' } });
    fireEvent.change(screen.getByLabelText('邮箱地址'), { target: { value: 'test@edu.cn' } });

    expect((screen.getByLabelText('姓名') as HTMLInputElement).value).toBe('张三');
    expect((screen.getByLabelText('学号') as HTMLInputElement).value).toBe('2024001');
    expect((screen.getByLabelText('邮箱地址') as HTMLInputElement).value).toBe('test@edu.cn');
  });

  it('3. 注册时两次密码不一致显示错误提示', async () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await switchToRegister();

    fireEvent.change(screen.getByLabelText('设置密码'), { target: { value: 'abc123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'abc456' } });

    // 确保勾选协议使按钮可用，然后直接触发表单提交
    fireEvent.click(screen.getByRole('checkbox'));

    // 直接 submit 表单确保触发 onSubmit
    const form = screen.getByRole('button', { name: /创建账号/ }).closest('form')!;
    fireEvent.submit(form);

    expect(toast.error).toHaveBeenCalledWith('两次输入的密码不一致');
  });

  it('4. 未勾选同意协议时创建账号按钮为禁用状态', async () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await switchToRegister();

    expect(screen.getByRole('button', { name: /创建账号/ })).toBeDisabled();
  });

  it('5. 勾选协议后创建账号按钮变为可用', async () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await switchToRegister();

    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('button', { name: /创建账号/ })).not.toBeDisabled();
  });

  it('6. 注册表单所有必填字段都有 required 属性', async () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await switchToRegister();

    expect(screen.getByLabelText('姓名')).toBeRequired();
    expect(screen.getByLabelText('学号')).toBeRequired();
    expect(screen.getByLabelText('邮箱地址')).toBeRequired();
    expect(screen.getByLabelText('设置密码')).toBeRequired();
    expect(screen.getByLabelText('确认密码')).toBeRequired();
  });
});

describe('Register Mock API 测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillRegisterForm = async () => {
    await userEvent.click(screen.getByRole('tab', { name: /注册/ }));
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '李四' } });
    fireEvent.change(screen.getByLabelText('学号'), { target: { value: '2024999' } });
    fireEvent.change(screen.getByLabelText('邮箱地址'), { target: { value: 'lisi@edu.cn' } });
    fireEvent.change(screen.getByLabelText('设置密码'), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('checkbox'));
  };

  it('1. [接口正常] 注册成功后提示成功', async () => {
    mockRegister.mockResolvedValueOnce({ data: { user: { id: 1, name: '李四' } } });

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await fillRegisterForm();
    fireEvent.click(screen.getByRole('button', { name: /创建账号/ }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: '李四',
        studentId: '2024999',
        password: 'pass123',
        contactInfo: 'lisi@edu.cn',
      });
      expect(toast.success).toHaveBeenCalledWith('注册成功，请切换到登录页进行登录');
    });
  });

  it('2. [接口失败] 注册失败时显示后端返回的错误消息', async () => {
    mockRegister.mockRejectedValueOnce({ response: { data: { message: '该学号已注册' } } });

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await fillRegisterForm();
    fireEvent.click(screen.getByRole('button', { name: /创建账号/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('该学号已注册');
    });
  });

  it('3. [网络异常] 无响应体时显示默认错误提示', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Network Error'));

    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    await fillRegisterForm();
    fireEvent.click(screen.getByRole('button', { name: /创建账号/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('注册失败，该学号/邮箱可能已被注册');
    });
  });
});
