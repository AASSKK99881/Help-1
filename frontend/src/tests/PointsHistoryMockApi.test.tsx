/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PointsHistory } from '../app/pages/student/PointsHistory';

vi.mock('../app/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: '测试用户', points: 120, studentId: '2024001', role: 'student' },
    isAuthenticated: true,
  })
}));

const mockGetPointsHistory = vi.fn();
vi.mock('../app/api/user', () => ({
  userApi: { getPointsHistory: () => mockGetPointsHistory() }
}));

describe('PointsHistory Mock API 测试', () => {

  it('1. [加载态] API 请求未完成时显示加载中...', () => {
    mockGetPointsHistory.mockReturnValue(new Promise(() => {})); // 永不 resolve

    render(<PointsHistory />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('2. [成功态] API 返回数据后正确渲染积分流水列表', async () => {
    mockGetPointsHistory.mockResolvedValueOnce({
      data: {
        list: [
          { id: 1, amount: 20, type: '完成任务', description: '帮忙拿外卖', createdAt: '2026-06-01', userId: 1, taskId: 1 },
          { id: 2, amount: -10, type: '发布任务', description: '请人代取快递', createdAt: '2026-06-02', userId: 1, taskId: 2 },
        ]
      }
    });

    render(<PointsHistory />);

    await waitFor(() => {
      expect(screen.getByText('完成任务')).toBeInTheDocument();
      expect(screen.getByText('发布任务')).toBeInTheDocument();
    });

    expect(screen.getByText('帮忙拿外卖')).toBeInTheDocument();
    expect(screen.getByText('请人代取快递')).toBeInTheDocument();
  });

  it('3. [空数据] API 返回空列表时显示暂无相关记录', async () => {
    mockGetPointsHistory.mockResolvedValueOnce({
      data: { list: [] }
    });

    render(<PointsHistory />);

    await waitFor(() => {
      expect(screen.getByText('暂无相关记录')).toBeInTheDocument();
    });
  });

  it('4. [失败态] API 请求失败时页面不崩溃，显示空列表提示', async () => {
    mockGetPointsHistory.mockRejectedValueOnce(new Error('Network Error'));

    render(<PointsHistory />);

    await waitFor(() => {
      expect(screen.getByText('暂无相关记录')).toBeInTheDocument();
    });
  });

  it('5. [统计面板] 正确计算并显示累计收入和支出', async () => {
    mockGetPointsHistory.mockResolvedValueOnce({
      data: {
        list: [
          { id: 1, amount: 50, type: '完成任务', description: '', createdAt: '2026-06-01', userId: 1, taskId: 1 },
          { id: 2, amount: -20, type: '发布需求', description: '', createdAt: '2026-06-02', userId: 1, taskId: 2 },
          { id: 3, amount: 30, type: '活动奖励', description: '', createdAt: '2026-06-03', userId: 1, taskId: 0 },
        ]
      }
    });

    render(<PointsHistory />);

    await waitFor(() => {
      expect(screen.getByText('+80')).toBeInTheDocument();  // 累计收入 50+30
    });
    expect(screen.getAllByText('-20')).toHaveLength(2);      // 统计面板 + 流水明细各一个
  });
});
