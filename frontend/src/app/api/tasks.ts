import apiClient from './client';

// 定义任务类型
export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  creatorId: string;
  createdAt: string;
}

// 分页查询参数类型
export interface TaskQueryParams {
  page?: number;
  size?: number;
  status?: string;
  keyword?: string;
}

export const tasksApi = {
  // 获取任务列表（包含分页和筛选，对标作业"数据查询"要求）
  getTasks: (params?: TaskQueryParams) => {
    return apiClient.get<{ code: number; data: { total: number; list: Task[] } }>('/tasks', { params });
  },

  // 获取单个任务详情
  getTaskById: (id: string) => {
    return apiClient.get<{ code: number; data: Task }>(`/tasks/${id}`);
  },

  // 发布新委托任务（对标作业"核心业务 CRUD"要求）
  createTask: (data: { title: string; description: string; points: number }) => {
    return apiClient.post<{ code: number; data: Task }>('/tasks', data);
  },

  // 接取任务
  acceptTask: (id: string) => {
    return apiClient.post<{ code: number; data: any }>(`/tasks/${id}/accept`);
  },
  
  // 确认任务完成
  completeTask: (id: string) => {
    return apiClient.put<{ code: number; data: any }>(`/tasks/${id}/complete`);
  }
};