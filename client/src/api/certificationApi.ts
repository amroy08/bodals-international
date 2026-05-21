import api from './axiosInstance';

export const certificationApi = {
  getAll: () => api.get('/certifications'),
  getById: (id: number) => api.get(`/certifications/${id}`),
  create: (data: FormData) => api.post('/certifications', data),
  update: (id: number, data: FormData) => api.put(`/certifications/${id}`, data),
  delete: (id: number) => api.delete(`/certifications/${id}`),
};
