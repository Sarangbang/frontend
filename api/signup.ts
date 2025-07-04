import apiClient from './apiClient';
import { SignUpRequest } from '@/types/SignUp';
import { SignUpResponse } from '@/types/SignUp';

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiClient.post<SignUpResponse>('/users/signup', data);
    return response.data;
};