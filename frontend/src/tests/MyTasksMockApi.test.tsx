/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { MyTasks } from '../app/pages/student/MyTasks';
import { toast } from 'sonner';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() }
}));

const mockGetMyPublished = vi.fn();
const mockGetMyAccepted = vi.fn();
const mockCompleteTask = vi.fn();
const mockCancelTask = vi.fn();

vi.mock('../app/api/tasks', () => ({
  tasksApi: {
    getMyPublished: () => mockGetMyPublished(),
    getMyAccepted: () => mockGetMyAccepted(),
    completeTask: (id: any) => mockCompleteTask(id),
    cancelTask: (id: any) => mockCancelTask(id),
  }
}));

const samplePublishedTask = {
  id: 1,
  title: '帮忙拿外卖',
  category: '生活帮助',
  pointsReward: 10,
  status: 2,
  deadline: '2026-12-31',
  publisherId: 1,
  acceptorId: 2,
  description: '',
  createdAt: '2026-06-01',
};

const sampleAcceptedTask = {
  id: 2,
  title: '代取快递',
  category: '生活帮助',
  pointsReward: 15,
  status: 2,
  deadline: '2026-12-31',
  publisherId: 3,
  acceptorId: 1,
  description: '',
  createdAt: '2026-06-02',
};

describe('MyTasks Mock API 测试', () => {

  it('1. [加载态] API 请求未完成时显示加载中...', () => {
    mockGetMyPublished.mockReturnValue(new Promise(() => {}));
    mockGetMyAccepted.mockReturnValue(new Promise(() => {}));

    render(<BrowserRouter><MyTasks /></BrowserRouter>);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('2. [成功态] API 返回数据后正确渲染已发布任务', async () => {
    mockGetMyPublished.mockResolvedValueOnce({
      data: { list: [samplePublishedTask] }
    });
    mockGetMyAccepted.mockResolvedValueOnce({
      data: { list: [sampleAcceptedTask] }
    });

    render(<BrowserRouter><MyTasks /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('帮忙拿外卖')).toBeInTheDocument();
    });
    expect(screen.getByText('10 积分')).toBeInTheDocument();
  });

  it('3. [空数据] 无已发布任务时显示空状态引导', async () => {
    mockGetMyPublished.mockResolvedValueOnce({ data: { list: [] } });
    mockGetMyAccepted.mockResolvedValueOnce({ data: { list: [] } });

    render(<BrowserRouter><MyTasks /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('还没有发布任何需求')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /发布第一个需求/ })).toBeInTheDocument();
    });
  });

  it('4. [失败态] API 出错时页面不崩溃', async () => {
    mockGetMyPublished.mockRejectedValueOnce(new Error('Network Error'));
    mockGetMyAccepted.mockResolvedValueOnce({ data: { list: [] } });

    render(<BrowserRouter><MyTasks /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('还没有发布任何需求')).toBeInTheDocument();
    });
  });

  it('5. [确认完成] 点击确认完成弹出对话框并调用 API', async () => {
    mockGetMyPublished.mockResolvedValueOnce({
      data: { list: [{ ...samplePublishedTask, status: 2 }] }
    });
    mockGetMyAccepted.mockResolvedValueOnce({ data: { list: [] } });
    mockCompleteTask.mockResolvedValueOnce({ data: 'success' });

    render(<BrowserRouter><MyTasks /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('帮忙拿外卖')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /确认完成/ }));

    await waitFor(() => {
      expect(screen.getByText('确认任务已完成？')).toBeInTheDocument();
    });

    // Click confirm in dialog
    const confirmBtns = screen.getAllByRole('button', { name: /确认完成/ });
    await userEvent.click(confirmBtns[confirmBtns.length - 1]);

    await waitFor(() => {
      expect(mockCompleteTask).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('6. [切换Tab] 切换到已接取tab显示已接取任务', async () => {
    mockGetMyPublished.mockResolvedValueOnce({ data: { list: [] } });
    mockGetMyAccepted.mockResolvedValueOnce({
      data: { list: [sampleAcceptedTask] }
    });

    render(<BrowserRouter><MyTasks /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('还没有发布任何需求')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('tab', { name: /我接取的/ }));

    await waitFor(() => {
      expect(screen.getByText('代取快递')).toBeInTheDocument();
      expect(screen.getByText('15 积分')).toBeInTheDocument();
    });
  });

  it('7. [取消任务] 点击取消任务弹出确认对话框并调用 cancel API', async () => {
    mockGetMyPublished.mockResolvedValueOnce({
      data: { list: [{ ...samplePublishedTask, status: 2 }] }
    });
    mockGetMyAccepted.mockResolvedValueOnce({ data: { list: [] } });
    mockCancelTask.mockResolvedValueOnce({ data: 'success' });

    render(<BrowserRouter><MyTasks /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('帮忙拿外卖')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /取消任务/ }));

    await waitFor(() => {
      // 对话框标题
      expect(screen.getByRole('heading', { name: '取消任务' })).toBeInTheDocument();
      expect(screen.getByText(/扣除一定积分作为违约金/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /确认取消/ }));

    await waitFor(() => {
      expect(mockCancelTask).toHaveBeenCalledWith(1);
      expect(toast.warning).toHaveBeenCalled();
    });
  });
});
