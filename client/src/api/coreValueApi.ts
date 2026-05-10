import api from './axiosInstance';

export const coreValueApi = {
  getAll: () => api.get('/core-values'),
  create: (data: any) => api.post('/core-values', data),
  update: (id: number, data: any) => api.put(`/core-values/${id}`, data),
  delete: (id: number) => api.delete(`/core-values/${id}`),
};
