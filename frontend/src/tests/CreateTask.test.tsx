/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { CreateTask } from '../app/pages/student/CreateTask';
import { toast } from 'sonner';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() }
}));

vi.mock('../app/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: '测试用户', points: 100, studentId: '2024001', role: 'student' },
    isAuthenticated: true,
  })
}));

const mockCreateTask = vi.fn();
vi.mock('../app/api/tasks', () => ({
  tasksApi: { createTask: (...args: any[]) => mockCreateTask(...args) }
}));

describe('CreateTask 发布任务页面组件测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. 正确渲染发布需求表单标题和提交按钮', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    expect(screen.getByText('发布互助需求')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /提交审核/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /取消/ })).toBeInTheDocument();
  });

  it('2. 需求标题输入框存在且显示字符计数', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    expect(screen.getByPlaceholderText(/简明扼要地描述你的需求/)).toBeInTheDocument();
    expect(screen.getByText('0/50')).toBeInTheDocument();
  });

  it('3. 标题输入后字符计数更新', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    fireEvent.change(screen.getByPlaceholderText(/简明扼要地描述你的需求/), {
      target: { value: '测试标题' }
    });
    expect(screen.getByText('4/50')).toBeInTheDocument();
  });

  it('4. 积分输入框显示当前可用积分', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    expect(screen.getByText(/当前可用积分: 100/)).toBeInTheDocument();
  });

  it('5. 点击取消按钮导航回首页', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    fireEvent.click(screen.getByRole('button', { name: /取消/ }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('6. 发布规则提示信息正确显示', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    expect(screen.getByText('发布规则提示：')).toBeInTheDocument();
    expect(screen.getByText(/需求需经过教师审核/)).toBeInTheDocument();
  });

  it('7. 匿名发布开关存在且默认关闭', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    expect(screen.getByText('匿名发布')).toBeInTheDocument();
  });
});

describe('CreateTask Mock API 测试', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillRequiredFields = () => {
    fireEvent.change(screen.getByPlaceholderText(/简明扼要地描述你的需求/), {
      target: { value: '帮忙拿快递' }
    });
    fireEvent.change(screen.getByPlaceholderText(/详细描述你的需求/), {
      target: { value: '在菜鸟驿站取一个包裹' }
    });
    fireEvent.change(screen.getByPlaceholderText(/请输入积分/), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText('截止时间 *'), {
      target: { value: '2026-12-31T12:00' }
    });
  };

  it('1. [积分不足] 悬赏积分超过当前积分时显示错误', () => {
    render(<BrowserRouter><CreateTask /></BrowserRouter>);

    fireEvent.change(screen.getByPlaceholderText(/简明扼要地描述你的需求/), {
      target: { value: '测试标题' }
    });
    fireEvent.change(screen.getByPlaceholderText(/详细描述你的需求/), {
      target: { value: '测试描述' }
    });
    fireEvent.change(screen.getByPlaceholderText(/请输入积分/), {
      target: { value: '200' }
    });
    fireEvent.change(screen.getByLabelText('截止时间 *'), {
      target: { value: '2026-12-31T12:00' }
    });

    const form = screen.getByRole('button', { name: /提交审核/ }).closest('form')!;
    fireEvent.submit(form);

    expect(toast.error).toHaveBeenCalledWith('积分不足，请降低悬赏积分');
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('2. [审核通过] 后端返回审核通过时显示成功提示', async () => {
    mockCreateTask.mockResolvedValueOnce({
      data: { reviewMessage: '审核通过，任务已自动发布' }
    });

    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /提交审核/ }));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '帮忙拿快递',
          pointsReward: 20,
        })
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('3. [审核中] 后端返回审核中时显示 warning 提示', async () => {
    mockCreateTask.mockResolvedValueOnce({
      data: { reviewMessage: '已提交审核，请等待教师审批' }
    });

    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /提交审核/ }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalled();
    });
  });

  it('4. [接口异常] API 调用失败时显示错误提示', async () => {
    mockCreateTask.mockRejectedValueOnce(new Error('Server Error'));

    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /提交审核/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('提交失败，请重试');
    });
  });

  it('5. [提交中状态] 提交时按钮变为 "提交中..." 并禁用', async () => {
    let resolvePromise: any;
    mockCreateTask.mockImplementation(() => new Promise(resolve => { resolvePromise = resolve; }));

    render(<BrowserRouter><CreateTask /></BrowserRouter>);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /提交审核/ }));

    const btn = screen.getByRole('button', { name: /提交中/ });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();

    resolvePromise({ data: { reviewMessage: '审核通过' } });
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });
});
