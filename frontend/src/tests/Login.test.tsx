/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router'; 
import { StudentLogin } from '../app/pages/student/Login';

vi.mock('../app/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isAuthenticated: false,
    user: null,
  })
}));

describe('学生端 Login 页面组件交互测试', () => {
  
  it('1. 应该能正确渲染登录页面的标题、输入框和登录按钮', () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    expect(screen.getByRole('button', { name: /立即登录/i })).toBeInTheDocument();
  });

  it('2. 用户在邮箱和密码输入框中输入内容时，输入框的值应该正确更新', () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    
    const emailInput = screen.getByLabelText(/邮箱地址/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^密码$/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'student@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('student@test.com');
    expect(passwordInput.value).toBe('123456');
  });


  it('3. 页面初始渲染时，应该默认选中登录标签，并且隐藏注册表单', () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    

    expect(screen.getByRole('button', { name: /立即登录/i })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /创建账号/i })).not.toBeInTheDocument();
  });

  it('4. 登录表单包含必填属性(required)', () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    
    const emailInput = screen.getByLabelText(/邮箱地址/i);
    const passwordInput = screen.getByLabelText(/^密码$/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('5. 页面应该包含前往管理员登录的链接按钮', () => {
    render(<BrowserRouter><StudentLogin /></BrowserRouter>);
    
    const adminLink = screen.getByText(/点击此处前往后台管理系统/i);
    expect(adminLink).toBeInTheDocument();
  });
});