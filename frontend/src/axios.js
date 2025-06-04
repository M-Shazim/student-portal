import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Let nginx proxy /api to backend
});

export default api;
