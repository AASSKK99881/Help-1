import apiClient from './client';

// 1. 严格对齐后端 Entity (Task.java) 的字段
export interface Task {
  id: string | number;
  publisherId: string | number; // 对应后端 publisherId
  acceptorId?: string | number; 
  category?: string;
  title: string;
  description: string;
  pointsReward: number;         // 对应后端 pointsReward
  status: number;               // 对应后端 0待审, 1待接, 2进行中, 3完成
  deadline?: string;
  createdAt: string;
}

export interface TaskQueryParams {
  page?: number;
  size?: number;
  status?: string | number;
  keyword?: string;
}

export const tasksApi = {
  // 获取任务列表（期望返回 { total: 数量, list: 数组 }）
  getTasks: (params?: TaskQueryParams) => {
    return apiClient.get<{ code: number; data: { total: number; list: Task[] } }>('/tasks', { params });
  },

  getTaskById: (id: string) => {
    return apiClient.get<{ code: number; data: Task }>(`/tasks/${id}`);
  },

  // 2. 发布任务：发送时必须使用 pointsReward 字段
  createTask: (data: { title: string; description: string; pointsReward: number }) => {
    return apiClient.post<{ code: number; data: Task }>('/tasks', data);
  },

  // 3. 接取任务：补充后端 @RequestBody 需要的 studentId
  acceptTask: (id: string | number, studentId: number) => {
    return apiClient.post<{ code: number; data: any }>(`/tasks/${id}/accept`, { studentId: studentId });
  },
  
  // 4. 确认完成：修改为 POST 方法以匹配后端的 @PostMapping
  completeTask: (id: string | number) => {
    return apiClient.post<{ code: number; data: any }>(`/tasks/${id}/complete`);
  }
};