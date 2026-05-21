import api from './axiosInstance';

export const websiteApi = {
  getSettings: () => api.get('/website/settings'),
  updateSettings: (data: FormData | Record<string, any>) => api.put('/website/settings', data),
};
