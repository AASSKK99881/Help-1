/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Messages } from '../app/pages/student/Messages';

describe('Messages 消息中心组件测试', () => {

  it('1. 正确渲染页面标题和描述', () => {
    render(<Messages />);
    expect(screen.getByText('消息中心')).toBeInTheDocument();
    expect(screen.getByText('查看系统通知和订单消息')).toBeInTheDocument();
  });

  it('2. 默认显示系统通知标签页，且显示空状态提示', () => {
    render(<Messages />);
    expect(screen.getByText('暂无系统通知')).toBeInTheDocument();
  });

  it('3. 切换到订单通知标签页后显示订单空状态', async () => {
    render(<Messages />);
    await userEvent.click(screen.getByRole('tab', { name: /订单通知/ }));
    expect(screen.getByText('暂无订单通知')).toBeInTheDocument();
  });

  it('4. 系统通知和订单通知两个标签页都存在', () => {
    render(<Messages />);
    expect(screen.getByRole('tab', { name: /系统通知/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /订单通知/ })).toBeInTheDocument();
  });

  it('5. 标签页切换后系统通知空状态消失，显示订单空状态', async () => {
    render(<Messages />);
    await userEvent.click(screen.getByRole('tab', { name: /订单通知/ }));
    expect(screen.queryByText('暂无系统通知')).not.toBeInTheDocument();
    expect(screen.getByText('暂无订单通知')).toBeInTheDocument();
  });
});
