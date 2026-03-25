import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAQI = () => api.get('/aqi').then(res => res.data);
export const fetchWeather = () => api.get('/weather').then(res => res.data);
export const fetchForecast = () => api.get('/weather/forecast').then(res => res.data);
export const fetchAlerts = () => api.get('/alerts').then(res => res.data);
export const fetchReports = () => api.get('/reports').then(res => res.data);

export const submitReport = (data) => api.post('/reports', data).then(res => res.data);
export const createAlert = (data) => api.post('/alerts', data).then(res => res.data);

export const signup = (data) => api.post('/auth/signup', data).then(res => res.data);
export const login = (data) => api.post('/auth/login', data).then(res => res.data);

export default api;
