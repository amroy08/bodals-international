import api from './axiosInstance';

export const specialityApi = {
  getAll: () => api.get('/specialities'),
  create: (data: any) => api.post('/specialities', data),
  update: (id: number, data: any) => api.put(`/specialities/${id}`, data),
  delete: (id: number) => api.delete(`/specialities/${id}`),
};
