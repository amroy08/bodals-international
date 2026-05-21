import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bodals_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bodals_token');
      // Don't redirect — let the component handle it
    }
    return Promise.reject(error);
  }
);

export default api;
