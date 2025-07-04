import apiClient from './apiClient';
import { SignUpRequest } from '@/types/SignUpRequest';
import { SignUpResponse } from '@/types/SignUpResponse';

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiClient.post<SignUpResponse>('/users/signup', data);
    return response.data;
};