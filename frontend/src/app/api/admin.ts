import apiClient from './client';
import { Task } from './tasks';

export interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingReview: number;
  inProgress: number;
  todayTasks: number;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: number;
  points: number;
  status: number;
  createdAt: string;
}

export interface SensitiveWord {
  id: number;
  word: string;
  createdAt: string;
}

export const adminApi = {
  getStats: () => {
    return apiClient.get<{ code: number; data: AdminStats }>('/admin/stats');
  },

  getPendingTasks: () => {
    return apiClient.get<{ code: number; data: { total: number; list: Task[] } }>('/admin/tasks/pending');
  },

  approveTask: (id: number) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/tasks/${id}/approve`);
  },

  rejectTask: (id: number, reason: string) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/tasks/${id}/reject`, { reason });
  },

  getUsers: () => {
    return apiClient.get<{ code: number; data: { total: number; list: AdminUser[] } }>('/admin/users');
  },

  banUser: (id: number) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/users/${id}/ban`);
  },

  unbanUser: (id: number) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/users/${id}/unban`);
  },

  adjustPoints: (id: number, amount: number, reason: string) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/users/${id}/points`, { amount, reason });
  },

  getKeywords: () => {
    return apiClient.get<{ code: number; data: SensitiveWord[] }>('/admin/keywords');
  },

  addKeyword: (word: string) => {
    return apiClient.post<{ code: number; data: SensitiveWord }>('/admin/keywords', { word });
  },

  deleteKeyword: (id: number) => {
    return apiClient.delete<{ code: number; data: string }>(`/admin/keywords/${id}`);
  },

  createAdmin: (data: { name: string; username: string; password: string }) => {
    return apiClient.post<{ code: number; data: AdminUser }>('/admin/admins', data);
  },

  deleteAdmin: (id: number) => {
    return apiClient.delete<{ code: number; data: string }>(`/admin/admins/${id}`);
  },

  getActivities: () => {
    return apiClient.get<{ code: number; data: any[] }>('/admin/activities');
  },

  createActivity: (data: any) => {
    return apiClient.post<{ code: number; data: any }>('/admin/activities', data);
  },

  updateActivity: (id: number, data: any) => {
    return apiClient.put<{ code: number; data: any }>(`/admin/activities/${id}`, data);
  },

  getActivityDetail: (id: number) => {
    return apiClient.get<{ code: number; data: any }>(`/admin/activities/${id}`);
  },

  endActivity: (id: number) => {
    return apiClient.put<{ code: number; data: string }>(`/admin/activities/${id}/end`);
  },

  approveParticipant: (activityId: number, userId: number) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/activities/${activityId}/approve/${userId}`);
  },

  rejectParticipant: (activityId: number, userId: number) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/activities/${activityId}/reject/${userId}`);
  },

  rewardParticipant: (activityId: number, userId: number) => {
    return apiClient.post<{ code: number; data: string }>(`/admin/activities/${activityId}/reward/${userId}`);
  },

  removeParticipant: (activityId: number, userId: number) => {
    return apiClient.delete<{ code: number; data: string }>(`/admin/activities/${activityId}/participants/${userId}`);
  }
};
