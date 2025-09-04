import apiClient from './apiClient';
import { CategoryDto, CategoryName } from '@/types/Category';

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  try {
    const response = await apiClient.get<CategoryDto[]>('/categories');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getCategoryNames = async (): Promise<CategoryName[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};