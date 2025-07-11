import apiClient from './apiClient';
import { Region } from '@/types/Region';

// 시/도 지역 목록 조회
export const getSidoRegions = async (): Promise<Region[]> => {
  const response = await apiClient.get<Region[]>('/regions/sido');
  return response.data;
};

// 하위 지역 목록 조회
export const getSubRegions = async (regionId: number): Promise<Region[]> => {
  const response = await apiClient.get<Region[]>(`/regions/${regionId}`);
  return response.data;
}; 