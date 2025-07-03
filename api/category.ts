import apiClient from './apiClient';
import { Category, CategoryDto } from '@/types/Category';

// 각 카테고리에 순차적으로 할당될 배경색 배열입니다.
const bgColors = [
    'bg-yellow-100 dark:bg-yellow-900',
    'bg-blue-100 dark:bg-blue-900',
    'bg-green-100 dark:bg-green-900',
    'bg-purple-100 dark:bg-purple-900',
    'bg-orange-100 dark:bg-orange-900',
    'bg-pink-100 dark:bg-pink-900',
    'bg-teal-100 dark:bg-teal-900',
    'bg-indigo-100 dark:bg-indigo-900',
];

// 백엔드에서 받은 데이터(CategoryDto[])를 프론트엔드 UI에 필요한 데이터(Category[])로 변환하는 함수입니다.
// 각 카테고리 객체에 bgColor 속성을 추가해줍니다.
const mapBackendDataToFrontend = (data: CategoryDto[]): Category[] => {
    // 1. 백엔드 데이터를 프론트엔드 형식에 맞게 변환합니다.
    const mappedData = data.map((dto, index) => {
        return {
            ...dto,   // categoryId, categoryName, categoryImageUrl 등 백엔드에서 받은 값은 그대로 사용
            // 배경색 배열에서 현재 카테고리 순서(index)에 맞는 색상을 할당합니다.
            // 카테고리 개수가 색상 배열의 길이보다 많아도 나머지 연산자(%) 덕분에 오류 없이 순환됩니다.
            bgColor: bgColors[index % bgColors.length],
        };
    });

    // 2. 변환된 데이터를 categoryId를 기준으로 오름차순 정렬합니다.
    return mappedData.sort((a, b) => a.categoryId - b.categoryId);
};

// 백엔드 API('/api/categories')를 호출하여 카테고리 목록을 가져오는 메인 함수입니다.
// 이 함수는 다른 컴포넌트에서 실제로 사용하게 됩니다.
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    // apiClient를 사용해 GET 요청을 보냅니다. apiClient에는 기본 URL이 설정되어 있습니다.
    const response = await apiClient.get<CategoryDto[]>('/categories');
    // 백엔드로부터 받은 원본 데이터를 프론트엔드 형식에 맞게 가공하여 반환합니다.
    return mapBackendDataToFrontend(response.data);
  } catch (error) {
    // API 호출 중 에러가 발생하면 콘솔에 에러를 출력하고,
    console.error('카테고리 정보를 가져오는데 실패했습니다:', error);
    // 빈 배열을 반환하여 어플리케이션이 멈추지 않도록 합니다.
    return [];
  }
}; 