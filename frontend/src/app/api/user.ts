import apiClient from './client';

export interface PointsLog {
  id: number;
  userId: number;
  taskId: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export const userApi = {
  getProfile: () => {
    return apiClient.get<{ code: number; data: any }>('/user/profile');
  },

  getPointsHistory: () => {
    return apiClient.get<{ code: number; data: { total: number; list: PointsLog[] } }>('/user/points-history');
  },

  updateProfile: (data: { name?: string; email?: string; phone?: string }) => {
    return apiClient.put<{ code: number; data: any }>('/user/profile', data);
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return apiClient.put<{ code: number; data: string }>('/user/change-password', data);
  }
};
