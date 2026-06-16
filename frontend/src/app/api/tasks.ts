import apiClient from './client';

export interface Task {
  id: number;
  publisherId: number;
  acceptorId?: number;
  category?: string;
  title: string;
  description: string;
  isAnonymous?: number;
  pointsReward: number;
  status: number; // 0待审, 1待接, 2进行中, 3完成, 4已取消
  deadline?: string;
  createdAt: string;
}

export interface TaskContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface TaskDetailData {
  task: Task;
  publisher?: TaskContactInfo;
  acceptor?: TaskContactInfo;
}

export interface TaskQueryParams {
  page?: number;
  size?: number;
  status?: string | number;
  keyword?: string;
  category?: string;
}

export const tasksApi = {
  getTasks: (params?: TaskQueryParams) => {
    return apiClient.get<{ code: number; data: { total: number; list: Task[] } }>('/tasks', { params });
  },

  getTaskById: (id: string | number) => {
    return apiClient.get<{ code: number; data: TaskDetailData }>(`/tasks/${id}`);
  },

  createTask: (data: {
    title: string;
    description: string;
    pointsReward: number;
    category: string;
    deadline: string;
    isAnonymous?: number;
  }) => {
    return apiClient.post<{ code: number; data: { task: Task; reviewMessage: string } }>('/tasks', data);
  },

  getMyPublished: () => {
    return apiClient.get<{ code: number; data: { total: number; list: Task[] } }>('/tasks/my/published');
  },

  getMyAccepted: () => {
    return apiClient.get<{ code: number; data: { total: number; list: Task[] } }>('/tasks/my/accepted');
  },

  acceptTask: (id: string | number) => {
    return apiClient.post<{ code: number; data: string }>(`/tasks/${id}/accept`);
  },

  completeTask: (id: string | number) => {
    return apiClient.post<{ code: number; data: string }>(`/tasks/${id}/complete`);
  },

  cancelTask: (id: string | number) => {
    return apiClient.post<{ code: number; data: string }>(`/tasks/${id}/cancel`);
  },

  abandonTask: (id: string | number) => {
    return apiClient.post<{ code: number; data: string }>(`/tasks/${id}/abandon`);
  }
};
