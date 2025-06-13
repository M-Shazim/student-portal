import axios from 'axios';

const api = axios.create({
baseURL: 'http://13.48.120.194/api',
});

export default api;
