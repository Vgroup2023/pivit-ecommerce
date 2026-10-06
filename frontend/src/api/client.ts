import axios from 'axios';

const API_URL = (import.meta.env as any).VITE_API_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - extract data from response
client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API Endpoints
export const authAPI = {
  register: (data: any) => client.post('/auth/register', data),
  login: (data: any) => client.post('/auth/login', data),
  getMe: () => client.get('/auth/me'),
  logout: () => client.post('/auth/logout'),
};

export const productsAPI = {
  list: (limit = 50, offset = 0) => client.get('/products', { params: { limit, offset } }),
  get: (id: string) => client.get(`/products/${id}`),
  create: (data: any) => client.post('/products', data),
  update: (id: string, data: any) => client.patch(`/products/${id}`, data),
  delete: (id: string) => client.delete(`/products/${id}`),
  updateStock: (id: string, quantity: number) => client.post(`/products/${id}/stock`, { quantity }),
};

export const ordersAPI = {
  list: (limit = 50, offset = 0) => client.get('/orders', { params: { limit, offset } }),
  get: (id: string) => client.get(`/orders/${id}`),
  create: (data: any) => client.post('/orders', data),
  updateStatus: (id: string, status: string) => client.patch(`/orders/${id}/status`, { status }),
  delete: (id: string) => client.delete(`/orders/${id}`),
};

export const healthAPI = {
  check: () => client.get('/health'),
};

export default client;
