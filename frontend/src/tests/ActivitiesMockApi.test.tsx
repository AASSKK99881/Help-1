/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Activities } from '../app/pages/student/Activities';
import { toast } from 'sonner';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockList = vi.fn();
const mockApply = vi.fn();

vi.mock('../app/api/activities', () => ({
  activitiesApi: {
    list: () => mockList(),
    apply: (id: number) => mockApply(id),
  }
}));

const sampleActivities = [
  {
    id: 1,
    title: '校园义卖活动',
    description: '为山区儿童筹集善款',
    location: '大学生活动中心',
    startTime: '2026-06-20T09:00:00',
    endTime: '2026-06-20T17:00:00',
    requiredCount: 20,
    approvedCount: 8,
    pointsReward: 30,
  },
  {
    id: 2,
    title: '图书整理志愿者',
    description: '',
    location: '图书馆三楼',
    startTime: '2026-06-22T14:00:00',
    endTime: '2026-06-22T18:00:00',
    requiredCount: 10,
    approvedCount: 5,
    pointsReward: 20,
  }
];

describe('Activities 校园活动 Mock API 测试', () => {

  it('1. [加载态] API 请求未完成时显示加载中...', () => {
    mockList.mockReturnValue(new Promise(() => {}));
    render(<Activities />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('2. [成功态] API 返回活动列表后正确渲染', async () => {
    mockList.mockResolvedValueOnce({ data: sampleActivities });
    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('校园义卖活动')).toBeInTheDocument();
      expect(screen.getByText('图书整理志愿者')).toBeInTheDocument();
    });
    expect(screen.getByText('大学生活动中心')).toBeInTheDocument();
    expect(screen.getByText('图书馆三楼')).toBeInTheDocument();
  });

  it('3. [空数据] API 返回空列表时显示暂无活动提示', async () => {
    mockList.mockResolvedValueOnce({ data: [] });
    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('暂无招募中的活动')).toBeInTheDocument();
    });
  });

  it('4. [失败态] API 出错时页面不崩溃', async () => {
    mockList.mockReturnValueOnce(Promise.reject(new Error('Network Error')).catch(() => {}));
    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('暂无招募中的活动')).toBeInTheDocument();
    });
  });

  it('5. [报名成功] 点击报名后调用 API 并显示成功提示', async () => {
    mockList.mockResolvedValueOnce({ data: sampleActivities });
    mockApply.mockResolvedValueOnce({ data: 'success' });

    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('校园义卖活动')).toBeInTheDocument();
    });

    const applyBtns = screen.getAllByRole('button', { name: /立即报名/ });
    fireEvent.click(applyBtns[0]);

    await waitFor(() => {
      expect(mockApply).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('报名成功，等待管理员审核');
    });
  });

  it('6. [报名失败] 报名 API 失败时显示错误提示', async () => {
    mockList.mockResolvedValueOnce({ data: sampleActivities });
    mockApply.mockRejectedValueOnce({ response: { data: { message: '名额已满' } } });

    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('校园义卖活动')).toBeInTheDocument();
    });

    const applyBtns = screen.getAllByRole('button', { name: /立即报名/ });
    fireEvent.click(applyBtns[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('名额已满');
    });
  });

  it('7. [报名后状态] 报名成功后按钮变为已报名', async () => {
    mockList.mockResolvedValueOnce({ data: sampleActivities });
    mockApply.mockResolvedValueOnce({ data: 'success' });

    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('校园义卖活动')).toBeInTheDocument();
    });

    const applyBtns = screen.getAllByRole('button', { name: /立即报名/ });
    fireEvent.click(applyBtns[0]);

    await waitFor(() => {
      expect(screen.getByText('已报名')).toBeInTheDocument();
    });
  });

  it('8. 页面标题和描述正确渲染', async () => {
    mockList.mockResolvedValueOnce({ data: [] });
    render(<Activities />);

    await waitFor(() => {
      expect(screen.getByText('校园活动')).toBeInTheDocument();
      expect(screen.getByText('浏览和报名校园互助活动')).toBeInTheDocument();
    });
  });
});
