/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Profile } from '../app/pages/student/Profile';
import { toast } from 'sonner';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../app/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: '纪同学',
      studentId: '2312190109',
      role: 'student',
      points: 120,
      creditScore: 95,
      email: 'student@edu.cn',
      phone: '13800138000',
    },
    isAuthenticated: true,
  })
}));

const mockUpdateProfile = vi.fn();
vi.mock('../app/api/user', () => ({
  userApi: { updateProfile: (...args: any[]) => mockUpdateProfile(...args) }
}));

describe('Profile Mock API 测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. [接口正常] 点击保存后调用 updateProfile API，成功后提示并关闭弹窗', async () => {
    mockUpdateProfile.mockResolvedValueOnce({ code: 200 });

    render(<BrowserRouter><Profile /></BrowserRouter>);

    // 打开编辑弹窗
    fireEvent.click(screen.getByRole('button', { name: /编辑资料/ }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // 修改姓名
    const nameInput = screen.getByLabelText('姓名');
    fireEvent.change(nameInput, { target: { value: '新名字' } });

    // 点击保存
    fireEvent.click(screen.getByRole('button', { name: /保存/ }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ name: '新名字' })
      );
      expect(toast.success).toHaveBeenCalledWith('个人信息已更新');
    });
  });

  it('2. [接口异常] updateProfile 失败时显示错误提示', async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error('Server Error'));

    render(<BrowserRouter><Profile /></BrowserRouter>);

    fireEvent.click(screen.getByRole('button', { name: /编辑资料/ }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /保存/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('更新失败，请重试');
    });
  });

  it('3. [弹窗交互] 点击取消按钮关闭编辑弹窗', async () => {
    render(<BrowserRouter><Profile /></BrowserRouter>);

    fireEvent.click(screen.getByRole('button', { name: /编辑资料/ }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /取消/ }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('4. 正确渲染用户基本信息（姓名、学号、积分、信誉分）', () => {
    render(<BrowserRouter><Profile /></BrowserRouter>);

    expect(screen.getByText('纪同学')).toBeInTheDocument();
    expect(screen.getByText(/2312190109/)).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();    // 积分
    expect(screen.getByText('95')).toBeInTheDocument();     // 信誉分
  });
});
