import axios from 'axios';

const apiClient = axios.create({
  // 🎯 核心修改：优先读取环境变量中的后端地址，如果没有则默认请求本地 8080
  baseURL: 'http://localhost:8080/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('未登录或 Token 已过期，请重新登录');
          localStorage.removeItem('token');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('网络错误或请求超时');
    }
    return Promise.reject(error);
  }
);

export default apiClient;