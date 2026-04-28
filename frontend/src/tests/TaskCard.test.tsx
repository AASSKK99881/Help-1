/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../app/components/TaskCard';

const mockTask: any = {
  id: "task-1",
  title: '帮忙拿外卖',
  category: '生活服务',
  points: 10,
  status: 'open',
  deadline: '2026-12-31',
  publisher: { name: '测试用户' },
  tags: ['跑腿', '加急']
};

describe('TaskCard 组件渲染与边界测试', () => {

  it('6. 应该根据传入的 Props 正确渲染任务标题和悬赏积分', () => {

    render(<TaskCard task={mockTask} onNavigate={vi.fn()} />);
    
    expect(screen.getByText('帮忙拿外卖')).toBeInTheDocument();
    expect(screen.getByText(/10/i)).toBeInTheDocument();
  });

  it('7. 当任务包含多个 tag 时，应该正常渲染所有的标签', () => {
    const multiTagTask = { ...mockTask, tags: ['跑腿', '加急', '重物'] };
    render(<TaskCard task={multiTagTask} onNavigate={vi.fn()} />);
    
    expect(screen.getByText('跑腿')).toBeInTheDocument();
    expect(screen.getByText('重物')).toBeInTheDocument();
  });

  it('8. 点击卡片或按钮时应该触发 onNavigate 并回传 id', () => {
    const handleNavigate = vi.fn();
    render(<TaskCard task={mockTask} onNavigate={handleNavigate} />);

    const btn = screen.getByRole('button', { name: /接取任务/i });
    fireEvent.click(btn);
    
    expect(handleNavigate).toHaveBeenCalledWith('task-1');
  });
});