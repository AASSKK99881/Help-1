import apiClient from './client';

export interface PointsLog {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export const userApi = {
  // 获取当前登录用户资料
  getProfile: () => {
    return apiClient.get<{ code: number; data: any }>('/users/profile');
  },

  // 获取积分变更历史记录
  getPointsHistory: () => {
    return apiClient.get<{ code: number; data: PointsLog[] }>('/users/points-history');
  }
};