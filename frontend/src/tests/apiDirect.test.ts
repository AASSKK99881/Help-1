import { describe, it, expect, vi } from 'vitest';

// Mock apiClient before importing any api module
const mockGet = vi.fn().mockResolvedValue({});
const mockPost = vi.fn().mockResolvedValue({});
const mockPut = vi.fn().mockResolvedValue({});

vi.mock('../app/api/client', () => ({
  default: {
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args),
    put: (...args: any[]) => mockPut(...args),
  },
}));

describe('authApi 直接测试', () => {
  it('1. login 调用 client.post /auth/login', async () => {
    mockPost.mockResolvedValueOnce({ code: 200, data: { token: 't1', user: { id: '1' } } });
    const { authApi } = await import('../app/api/auth');
    const result = await authApi.login({ studentId: 'u1', password: 'p1' });
    expect(mockPost).toHaveBeenCalledWith('/auth/login', { studentId: 'u1', password: 'p1' });
    expect(result).toEqual({ code: 200, data: { token: 't1', user: { id: '1' } } });
  });

  it('2. register 调用 client.post /auth/register', async () => {
    const { authApi } = await import('../app/api/auth');
    await authApi.register({ name: 'n', studentId: 's1', password: 'p', contactInfo: 'c' });
    expect(mockPost).toHaveBeenCalledWith('/auth/register',
      { name: 'n', studentId: 's1', password: 'p', contactInfo: 'c' });
  });

  it('3. logout 调用 client.post /auth/logout', async () => {
    const { authApi } = await import('../app/api/auth');
    await authApi.logout();
    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
  });
});

describe('tasksApi 直接测试', () => {
  it('4. getTasks 调用 GET /tasks', async () => {
    const { tasksApi } = await import('../app/api/tasks');
    await tasksApi.getTasks({ keyword: 'k', page: 1 });
    expect(mockGet).toHaveBeenCalledWith('/tasks', { params: { keyword: 'k', page: 1 } });
  });

  it('5. getTaskById 调用 GET /tasks/:id', async () => {
    const { tasksApi } = await import('../app/api/tasks');
    await tasksApi.getTaskById(5);
    expect(mockGet).toHaveBeenCalledWith('/tasks/5');
  });

  it('6. acceptTask 调用 POST /tasks/:id/accept', async () => {
    const { tasksApi } = await import('../app/api/tasks');
    await tasksApi.acceptTask(3);
    expect(mockPost).toHaveBeenCalledWith('/tasks/3/accept');
  });

  it('7. cancelTask 调用 POST /tasks/:id/cancel', async () => {
    const { tasksApi } = await import('../app/api/tasks');
    await tasksApi.cancelTask(3);
    expect(mockPost).toHaveBeenCalledWith('/tasks/3/cancel');
  });

  it('8. getMyPublished 调用 GET /tasks/my/published', async () => {
    const { tasksApi } = await import('../app/api/tasks');
    await tasksApi.getMyPublished();
    expect(mockGet).toHaveBeenCalledWith('/tasks/my/published');
  });
});

describe('userApi 直接测试', () => {
  it('9. getProfile 调用 GET /user/profile', async () => {
    const { userApi } = await import('../app/api/user');
    await userApi.getProfile();
    expect(mockGet).toHaveBeenCalledWith('/user/profile');
  });

  it('10. getPointsHistory 调用 GET /user/points-history', async () => {
    const { userApi } = await import('../app/api/user');
    await userApi.getPointsHistory();
    expect(mockGet).toHaveBeenCalledWith('/user/points-history');
  });

  it('11. updateProfile 调用 PUT /user/profile', async () => {
    const { userApi } = await import('../app/api/user');
    await userApi.updateProfile({ name: 'n' });
    expect(mockPut).toHaveBeenCalledWith('/user/profile', { name: 'n' });
  });

  it('12. changePassword 调用 PUT /user/change-password', async () => {
    const { userApi } = await import('../app/api/user');
    await userApi.changePassword({ currentPassword: 'o', newPassword: 'n' });
    expect(mockPut).toHaveBeenCalledWith('/user/change-password', { currentPassword: 'o', newPassword: 'n' });
  });
});

describe('activitiesApi 直接测试', () => {
  it('13. list 调用 GET /activities', async () => {
    const { activitiesApi } = await import('../app/api/activities');
    await activitiesApi.list();
    expect(mockGet).toHaveBeenCalledWith('/activities');
  });

  it('14. apply 调用 POST /activities/:id/apply', async () => {
    const { activitiesApi } = await import('../app/api/activities');
    await activitiesApi.apply(7);
    expect(mockPost).toHaveBeenCalledWith('/activities/7/apply');
  });

  it('15. getMyActivities 调用 GET /user/my-activities', async () => {
    const { activitiesApi } = await import('../app/api/activities');
    await activitiesApi.getMyActivities();
    expect(mockGet).toHaveBeenCalledWith('/user/my-activities');
  });
});
