import apiClient from './apiClient';

import { TodayVerificationStatusResponse, VerificationCreateRequest, VerificationResponse } from '@/types/Verification';
import toast from 'react-hot-toast';

export const getTodayVerifications = async () : Promise<TodayVerificationStatusResponse[]> => {
  const response = await apiClient.get<TodayVerificationStatusResponse[]>('/challenge-verifications/status');
  return response.data;
};

export const createChallengeVerification = async (data: VerificationCreateRequest) => {  
  const response = await apiClient.post<VerificationResponse>('/challenge-verifications', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCompletedVerifications = async () => {
  try {
    const response = await apiClient.get('/challenge-verifications/my');
    return response.data;
  } catch (error) {
    toast.error('인증 완료 내역을 불러오는 데 실패했습니다.');
    throw error;
  }
}; 

