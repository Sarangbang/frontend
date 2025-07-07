import apiClient from './apiClient';
import { CategoryDto } from '@/types/Category';

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  try {
    const response = await apiClient.get<CategoryDto[]>('/categories');
    return response.data;
  } catch (error) {
    return [];
  }
}; 