/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Settings } from '../app/pages/student/Settings';
import { toast } from 'sonner';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../app/api/user', () => ({
  userApi: { changePassword: vi.fn() }
}));

describe('Settings 账号设置页面组件测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. 正确渲染三个密码输入框和确认修改按钮', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
    expect(screen.getByLabelText('当前密码')).toBeInTheDocument();
    expect(screen.getByLabelText('新密码')).toBeInTheDocument();
    expect(screen.getByLabelText('确认新密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /确认修改/ })).toBeInTheDocument();
  });

  it('2. 输入框的值随用户输入正确更新', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
    const currentInput = screen.getByLabelText('当前密码');
    const newInput = screen.getByLabelText('新密码');
    const confirmInput = screen.getByLabelText('确认新密码');

    fireEvent.change(currentInput, { target: { value: 'old123' } });
    fireEvent.change(newInput, { target: { value: 'new456' } });
    fireEvent.change(confirmInput, { target: { value: 'new456' } });

    expect((currentInput as HTMLInputElement).value).toBe('old123');
    expect((newInput as HTMLInputElement).value).toBe('new456');
    expect((confirmInput as HTMLInputElement).value).toBe('new456');
  });

  it('3. 两次输入的新密码不一致时显示错误提示', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('当前密码'), { target: { value: 'old123' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: 'new456' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: /确认修改/ }));

    expect(toast.error).toHaveBeenCalledWith('两次输入的新密码不一致');
  });

  it('4. 新密码少于6位时显示错误提示', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('当前密码'), { target: { value: 'old123' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /确认修改/ }));

    expect(toast.error).toHaveBeenCalledWith('新密码至少6位');
  });

  it('5. 点击返回按钮导航到个人中心', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /返回个人中心/ }));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('6. 所有密码输入框为必填且类型为password', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
    const inputs = [
      screen.getByLabelText('当前密码'),
      screen.getByLabelText('新密码'),
      screen.getByLabelText('确认新密码'),
    ];
    inputs.forEach(input => {
      expect(input).toBeRequired();
      expect(input.getAttribute('type')).toBe('password');
    });
  });
});
