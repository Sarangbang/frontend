import apiClient from './apiClient';
import { CategoryName } from '@/types/CategoryName';

export const getCategoryNames = async (): Promise<CategoryName[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};
