import { http, HttpResponse } from 'msw';

export const handlers = [
  // 1. 模拟登录接口
  http.post('/api/auth/login', async ({ request }) => {
    // 假设不管输入什么，都登录成功
    return HttpResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-jwt-token-123456',
        user: {
          id: 'u1',
          studentId: '20230001',
          name: '测试学生',
          role: 'STUDENT'
        }
      }
    });
  }),

  // 2. 模拟获取任务列表接口
  http.get('/api/tasks', ({ request }) => {
    return HttpResponse.json({
      code: 200,
      data: {
        total: 2,
        list: [
          {
            id: 't1',
            title: '帮忙拿一下快递',
            description: '南区菜鸟驿站，中件',
            points: 10,
            status: 'OPEN',
            creatorId: 'u2',
            createdAt: new Date().toISOString()
          },
          {
            id: 't2',
            title: '高数课后辅导',
            description: '求助第三章微积分的几道习题',
            points: 30,
            status: 'OPEN',
            creatorId: 'u3',
            createdAt: new Date().toISOString()
          }
        ]
      }
    });
  }),

  // 3. 模拟发布新任务接口
  http.post('/api/tasks', async ({ request }) => {
    const newTask = await request.json() as any;
    return HttpResponse.json({
      code: 201, // 201 表示创建成功
      data: {
        id: 't3',
        title: newTask.title,
        description: newTask.description,
        points: newTask.points,
        status: 'OPEN',
        creatorId: 'u1',
        createdAt: new Date().toISOString()
      }
    });
  })
];