/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PointsBadge } from '../app/components/PointsBadge';

describe('PointsBadge 组件渲染测试', () => {

  it('1. 正确渲染积分数字', () => {
    render(<PointsBadge points={50} />);
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText(/积分/)).toBeInTheDocument();
  });

  it('2. 传入自定义 className 时正确合并样式', () => {
    render(<PointsBadge points={100} className="custom-extra" />);
    const badge = screen.getByText(/100/);
    expect(badge.className).toContain('custom-extra');
    expect(badge.className).toContain('bg-yellow-100');
  });

  it('3. 渲染零积分', () => {
    render(<PointsBadge points={0} />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });
});
