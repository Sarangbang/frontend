import apiClient from './apiClient';
import { TodayVerificationStatusResponse, VerificationCreateRequest, VerificationResponse } from '@/types/Verification';

export const submitVerification = async (formData: FormData) => {
	console.log(formData);
  // try {
  //   // TODO: API 엔드포인트 확정 후 수정 필요
  //   const response = await apiClient.post('/verifications', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  //   return response.data;
  // } catch (error) {
  //   console.error('인증 제출에 실패했습니다.', error);
  //   throw error;
  // }
};

export const getTodayVerifications = async () : Promise<TodayVerificationStatusResponse[]> => {
  const response = await apiClient.get<TodayVerificationStatusResponse[]>('/challenge-verifications/status');
  return response.data;
};

export const createChallengeVerification = async (data: VerificationCreateRequest) => {  
  const response = await apiClient.post<VerificationResponse>('/challenge-verifications', data);
  return response.data;
};