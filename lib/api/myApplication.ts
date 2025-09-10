// lib/api/myApplications.ts
import apiClient from './apiClient';
import type { MyPageApplication } from '@/types/MyPageApplication';

/**
 * 내 챌린지 신청내역 조회
 * 백엔드: GET /api/challenge/application/my-applications
 */
export const fetchMyApplications = async (): Promise<MyPageApplication[]> => {
  const res = await apiClient.get<MyPageApplication[]>('/challenge/application/my-applications');
  return res.data;
};
