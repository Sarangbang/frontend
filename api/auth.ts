import { LoginRequest } from '@/types/LoginRequest';
import apiClient from './apiClient';
import { LoginResponse } from '@/types/LoginResponse';

// 로그인 API 요청
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(`/users/signin`, data);
  return response.data;
};
