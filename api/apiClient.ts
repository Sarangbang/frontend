import axios from 'axios';
import router from 'next/router';

export const getServerURL = () => {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        return process.env.INTERNAL_API_BASE_URL || 'http://localhost:8080/api';
    }
    return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080/api';
}; 

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

// apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // 401 오류 & 재발급 시도 전이 아니라면
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const deviceId = localStorage.getItem('deviceId');

//             try {
//                 const res = await axios.post(
//                     `${getServerURL()}/auth/reissue`,
//                     {},
//                     {
//                         headers: {
//                             'Device-Id': deviceId,
//                             Authorization: localStorage.getItem('accessToken'),
//                         },
//                         withCredentials: true,
//                     }
//                 );

//                 const newAccessToken = res.headers['authorization']?.split(' ')[1];
//                 if (newAccessToken) {
//                     localStorage.setItem('accessToken', newAccessToken);
//                     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                     return axios(originalRequest); // 재요청
//                 }
//             } catch (reissueError) {
//                 // 리프레시 토큰 만료 로그아웃 처리
//                 console.warn('❌ 토큰 재발급 실패: 자동 로그아웃');
//                 try {
//                     await axios.post(
//                         `${getServerURL()}/auth/logout`,
//                         {},
//                         {
//                             headers: {
//                                 Authorization: localStorage.getItem('accessToken'),
//                                 'Device-Id': localStorage.getItem('deviceId'),
//                             },
//                             withCredentials: true,
//                         }
//                     );
//                 } catch (logoutError) {
//                     console.error('❗ 로그아웃 API 호출 실패:', logoutError);
//                 }

//                 // ✅ 상태 초기화 + 리디렉션
//                 const { logout } = useAuthStore.getState();
//                 logout();
//                 router.push('/login');
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default apiClient;
