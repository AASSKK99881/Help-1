/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Settings } from '../app/pages/student/Settings';
import { toast } from 'sonner';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockChangePassword = vi.fn();
vi.mock('../app/api/user', () => ({
  userApi: { changePassword: (...args: any[]) => mockChangePassword(...args) }
}));

describe('Settings Mock API 测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [接口正常响应] 修改密码成功时显示成功提示并清空表单', async () => {
    mockChangePassword.mockResolvedValueOnce({ code: 200, data: 'success' });

    render(<BrowserRouter><Settings /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('当前密码'), { target: { value: 'oldPass' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: 'newPass123' } });
    fireEvent.click(screen.getByRole('button', { name: /确认修改/ }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'oldPass',
        newPassword: 'newPass123',
      });
      expect(toast.success).toHaveBeenCalledWith('密码修改成功');
    });

    expect((screen.getByLabelText('当前密码') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('新密码') as HTMLInputElement).value).toBe('');
  });

  it('2. [接口异常] 修改密码失败时显示错误提示', async () => {
    mockChangePassword.mockRejectedValueOnce(new Error('Wrong password'));

    render(<BrowserRouter><Settings /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('当前密码'), { target: { value: 'wrongPass' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: 'newPass123' } });
    fireEvent.click(screen.getByRole('button', { name: /确认修改/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('修改失败，请检查当前密码是否正确');
    });
  });

  it('3. [提交中状态] API 调用期间按钮显示 "修改中..." 并禁用', async () => {
    // 让 promise 不立即 resolve，以观察 submitting 状态
    let resolvePromise: any;
    mockChangePassword.mockImplementation(() => new Promise(resolve => { resolvePromise = resolve; }));

    render(<BrowserRouter><Settings /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText('当前密码'), { target: { value: 'oldPass' } });
    fireEvent.change(screen.getByLabelText('新密码'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('确认新密码'), { target: { value: 'newPass123' } });
    fireEvent.click(screen.getByRole('button', { name: /确认修改/ }));

    // 按钮应变为 "修改中..." 且 disabled
    const btn = screen.getByRole('button', { name: /修改中/ });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();

    // 完成请求
    resolvePromise({ code: 200 });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
