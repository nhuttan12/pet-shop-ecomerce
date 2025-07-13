import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Thay đổi nếu backend dùng port khác
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // nếu backend dùng cookie
});

// Thêm interceptor gửi token tự động (lấy từ localStorage hoặc nơi lưu token của bạn)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default api;
