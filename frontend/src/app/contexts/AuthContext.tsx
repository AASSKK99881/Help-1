import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth'; // 引入真实的 API

interface User {
  id: string;
  name: string;
  studentId?: string;
  teacherId?: string;
  role: 'student' | 'admin';
  points: number;
  creditScore?: number;
  avatar?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'admin') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 从localStorage恢复用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'admin') => {
    // 🎯 核心修改：调用真实的后端 API
    try {
      const response = await authApi.login({ studentId: email, password: password });
      
      // Axios 拦截器已经剥离了 response.data，这里 response 直接是后端返回的 Result 对象
      if (response && response.data && response.data.user) {
        const realUser = response.data.user;
        const token = response.data.token;

        // 保存 Token 到 localStorage 供后续请求使用
        if (token) {
          localStorage.setItem('token', token);
        }

        const loggedUser: User = {
          id: realUser.id?.toString() || '1',
          name: realUser.name || realUser.username || '未命名用户',
          studentId: realUser.username,
          role: realUser.role === 1 || realUser.role === 'ADMIN' ? 'admin' : 'student',
          points: realUser.points || 0,
          creditScore: realUser.creditScore ?? 100,
          email: realUser.email || email,
          phone: realUser.phone || '',
        };

        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
      } else {
        throw new Error('登录失败，返回数据格式错误');
      }
    } catch (error) {
      console.error("登录失败:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // 退出时记得清除 token
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}