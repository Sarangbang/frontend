import apiClient from './apiClient';
import toast from 'react-hot-toast';

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

export const getCompletedVerifications = async () => {
  try {
    const response = await apiClient.get('/challenge-verifications/my');
    return response.data;
  } catch (error) {
    toast.error('인증 완료 내역을 불러오는 데 실패했습니다.');
    throw error;
  }
}; 