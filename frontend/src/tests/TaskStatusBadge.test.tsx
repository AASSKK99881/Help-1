/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskStatusBadge } from '../app/components/TaskStatusBadge';

describe('TaskStatusBadge 组件渲染测试', () => {

  it('1. 传入 "待接取" 时渲染对应文本和蓝色样式', () => {
    render(<TaskStatusBadge status="待接取" />);
    const badge = screen.getByText('待接取');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-blue-50');
    expect(badge.className).toContain('text-blue-700');
  });

  it('2. 传入 "进行中" 时渲染对应文本和橙色样式', () => {
    render(<TaskStatusBadge status="进行中" />);
    const badge = screen.getByText('进行中');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-orange-50');
    expect(badge.className).toContain('text-orange-700');
  });

  it('3. 传入 "已完成" 时渲染对应文本和绿色样式', () => {
    render(<TaskStatusBadge status="已完成" />);
    const badge = screen.getByText('已完成');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-green-50');
    expect(badge.className).toContain('text-green-700');
  });

  it('4. 传入未知状态时渲染默认灰色样式', () => {
    render(<TaskStatusBadge status="未知状态" />);
    const badge = screen.getByText('未知状态');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-gray-50');
    expect(badge.className).toContain('text-gray-700');
  });
});
