// src/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/auth', // Thay đổi nếu backend dùng port khác
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // nếu backend dùng cookie
});

export default api;
