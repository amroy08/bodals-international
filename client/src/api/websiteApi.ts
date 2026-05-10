import api from './axiosInstance';

export const websiteApi = {
  getSettings: () => api.get('/website/settings'),
  updateSettings: (data: FormData | Record<string, any>) => {
    if (data instanceof FormData) {
      return api.put('/website/settings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put('/website/settings', data);
  },
};
