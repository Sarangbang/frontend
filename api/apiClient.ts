import axios from 'axios';
import { getServerURL } from '@/lib/config';

const apiClient = axios.create({
    baseURL: getServerURL(),
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
        config.headers['Device-Id'] = deviceId;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');

            if (typeof window !== 'undefined') {
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                if (window.location.pathname !== '/login') {
                    console.log('redirecting to login');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
