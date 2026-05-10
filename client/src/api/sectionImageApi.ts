import api from './axiosInstance';

export const sectionImageApi = {
  getBySection: (section: string) => api.get(`/section-images/section/${section}`),
  getAll: () => api.get('/section-images'),
  create: (data: FormData) => api.post('/section-images', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) => api.put(`/section-images/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/section-images/${id}`),
};
