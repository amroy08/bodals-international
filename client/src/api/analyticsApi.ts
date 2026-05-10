import api from './axiosInstance';

export const analyticsApi = {
  trackVisit: (data: { page: string; device: string; browser: string }) =>
    api.post('/analytics/track-visit', data),
  getDashboard: () => api.get('/analytics/dashboard'),
  getCountries: () => api.get('/analytics/countries'),
  getRecentVisitors: () => api.get('/analytics/recent-visitors'),
};
