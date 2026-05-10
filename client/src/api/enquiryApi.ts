import api from './axiosInstance';

export interface EnquiryForm {
  name: string; position: string; company: string; email: string;
  mobile: string; city_country: string; message: string;
}

export const enquiryApi = {
  submit: (data: EnquiryForm) => api.post('/enquiries', data),
  getAll: (params?: Record<string, string>) => api.get('/enquiries', { params }),
  getById: (id: number) => api.get(`/enquiries/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/enquiries/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/enquiries/${id}`),
};
