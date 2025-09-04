import apiClient from './apiClient';
import { SignUpRequest, SignUpResponse } from '@/types/SignUp';
import { createSignUpFormData } from '@/util/formDataUtils';

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {

  const formData = createSignUpFormData(data);

  const response = await apiClient.post<SignUpResponse>('/users/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};