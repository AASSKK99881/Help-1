import apiClient from './client';

// 定义请求参数的类型
export interface LoginData {
  studentId: string;
  password: string;
}

export interface RegisterData {
  studentId: string;
  name: string;
  password: string;
  contactInfo?: string; 
}


export interface AuthResponse {
  token: string;
  user: {
    id: string;
    studentId: string;
    name: string;
    role: string;
  };
}

export const authApi = {
  // 学生登录
  login: (data: LoginData) => {
    return apiClient.post<{ code: number; data: AuthResponse; message: string }>('/auth/login', data);
  },
  
  // 学生注册
  register: (data: RegisterData) => {
    return apiClient.post<{ code: number; data: any; message: string }>('/auth/register', data);
  },
  
  // 退出登录
  logout: () => {
    return apiClient.post('/auth/logout');
  }
};