export interface Category {
  categoryId: number; // 카테고리 고유 ID
  categoryName: string; // 카테고리 이름
  categoryImageUrl: string; // 프론트엔드에서 사용할 이미지 경로
  bgColor: string; // 프론트엔드에서 사용할 배경색 클래스
}

export interface CategoryDto {
    categoryId: number; // 백엔드에서 받는 카테고리 고유 ID
    categoryName:string; // 백엔드에서 받는 카테고리 이름
    categoryImageUrl:string; // 백엔드에서 받는 카테고리 이미지 URL
} 