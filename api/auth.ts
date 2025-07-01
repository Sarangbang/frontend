import apiClient from './apiClient';
import { getServerURL } from '@/lib/config';

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
}

// 로그인 API 요청
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(`${getServerURL()}/users/signin`, data);
  return response.data;
};
