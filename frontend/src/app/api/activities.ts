import apiClient from './client';

export const activitiesApi = {
  list: () => {
    return apiClient.get<{ code: number; data: any[] }>('/activities');
  },
  apply: (id: number) => {
    return apiClient.post<{ code: number; data: string }>(`/activities/${id}/apply`);
  },
  getMyActivities: () => {
    return apiClient.get<{ code: number; data: any[] }>('/user/my-activities');
  }
};
