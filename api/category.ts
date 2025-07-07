import apiClient from './apiClient';
import { Category } from '@/types/Category';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};
