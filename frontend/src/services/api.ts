import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('smarthire_user');
    if (stored) {
      const user = JSON.parse(stored);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
