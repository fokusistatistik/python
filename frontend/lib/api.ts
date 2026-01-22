import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    // Client-side only check
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await api.post('/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const getSystemInfo = async () => {
  const response = await api.get('/system-info');
  return response.data;
};

export const analyzeJson = async (data: number[]) => {
  const response = await api.post('/analyze-json', { data });
  return response.data;
};

export const analyzeFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/analyze-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
