import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getServerURL } from '@/lib/config';

// 토큰 갱신 상태 관리
let isRefreshing = false; // 현재 토큰 갱신 중인지 확인
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
    config: AxiosRequestConfig;
}> = []; // 토큰 갱신 중 대기하는 요청들의 큐

// 큐에 저장된 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            // 새로운 토큰으로 헤더 업데이트 후 요청 재시도
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(config));
        }
    });
    
    failedQueue = [];
};

const apiClient = axios.create({
    baseURL: getServerURL(),
    withCredentials: true, // refresh token 쿠키 전송을 위해 필요
});

// 요청 인터셉터: access token을 헤더에 추가
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('am');
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

// 응답 인터셉터: 401 오류 시 토큰 갱신 처리
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // 401 오류이고 아직 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // refresh 엔드포인트 자체에서 401이 발생한 경우 바로 로그아웃 처리
            if (originalRequest.url?.includes('/users/refresh')) {
                isRefreshing = false;
                processQueue(error, null);
                
                // 로컬 스토리지 정리 및 로그인 페이지로 이동
                localStorage.removeItem('am');
                if (typeof window !== 'undefined') {
                    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }

            // 이미 토큰 갱신 중인 경우 큐에 요청 저장
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 토큰 갱신 시도 (순환 참조 방지를 위해 직접 axios 사용)
                const refreshResponse = await axios.post<{ accessToken: string }>(
                    `${getServerURL()}/users/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.accessToken;
                
                // 새로운 토큰을 로컬 스토리지에 저장
                localStorage.setItem('am', newAccessToken);
                
                // 현재 요청의 헤더에 새로운 토큰 적용
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                // 큐에 저장된 다른 요청들도 처리
                processQueue(null, newAccessToken);
                
                isRefreshing = false;
                
                // 원래 요청을 새로운 토큰으로 재시도
                return apiClient(originalRequest);
                
            } catch (refreshError) {
                // 토큰 갱신 실패 시 모든 대기 중인 요청 실패 처리
                processQueue(refreshError, null);
                isRefreshing = false;
                
                // 로컬 스토리지 정리 및 로그인 페이지로 이동
                localStorage.removeItem('am');
                if (typeof window !== 'undefined') {
                    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
