import { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/Login';
import apiClient from './apiClient';

// 로그인 API 요청
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(`/users/signin`, data);
  return response.data;
};

// 토큰 재발급 API 요청 (refresh token을 쿠키로 자동 전송)
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(`/users/refresh`);
  return response.data;
};

// 로그아웃 API 요청 (refresh token 삭제 및 쿠키 만료)
export const logout = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(`/users/logout`);
  return response.data;
};
