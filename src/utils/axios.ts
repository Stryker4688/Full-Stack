// src/utils/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auto-add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle responses - FIXED: خطاها را به درستی مدیریت می‌کند
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // فقط برای خطای 401 redirect انجام بده
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        // سایر خطاها را بدون تغییر pass through می‌کنیم
        return Promise.reject(error);
    }
);

export default api;