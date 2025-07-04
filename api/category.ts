import apiClient from './apiClient';
import { CategoryDto } from '@/types/Category';

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  try {
    const response = await apiClient.get<CategoryDto[]>('/categories');
    return response.data.sort((a, b) => a.categoryId - b.categoryId);
  } catch (error) {
    console.error('카테고리 정보를 가져오는데 실패했습니다:', error);
    return [];
  }
}; 