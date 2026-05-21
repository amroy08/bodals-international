import api from './axiosInstance';

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: FormData) => api.post('/products', data),
  update: (id: number, data: FormData) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};
