import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://pos.wajen.net/api/v1/',
  baseURL: 'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to update the Authorization header with the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
