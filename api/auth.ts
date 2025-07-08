import { LoginRequest, LoginResponse } from '@/types/Login';
import apiClient from './apiClient';

// 로그인 API 요청
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(`/users/signin`, data);
  return response.data;
};
