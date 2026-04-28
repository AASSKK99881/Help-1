import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  studentId?: string;
  teacherId?: string;
  role: 'student' | 'admin';
  points: number;
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
    // 模拟登录逻辑
    const mockUser: User = role === 'student' 
      ? {
          id: '1',
          name: '张三',
          studentId: '2021001',
          role: 'student',
          points: 500,
          email: email,
          phone: '138****5678'
        }
      : {
          id: 'admin1',
          name: '李老师',
          teacherId: 'T2021001',
          role: 'admin',
          points: 0,
          email: email
        };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
