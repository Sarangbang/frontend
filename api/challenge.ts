import apiClient from './apiClient';
import { ChallengeCreateRequest } from '@/types/Challenge';

/**
 * 신규 챌린지를 등록합니다
 * @param data Challenge 생성 요청 데이터
 * @returns 생성된 챌린지 정보
 */
export const createChallenge = async (data: ChallengeCreateRequest) => {  
    const response = await apiClient.post('/challenges', data);
    return response.data;
};