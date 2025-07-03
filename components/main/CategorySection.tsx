'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
// 스와이프 UI를 위한 Swiper 라이브러리에서 필요한 컴포넌트와 CSS를 가져옵니다.
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper의 기본 스타일을 적용합니다.

// 위에서 만든 API 호출 함수와 데이터 타입을 가져옵니다.
import { fetchCategories } from '@/api/category';
import type { Category } from '@/types/Category';

// 개별 카테고리 아이콘을 표시하는 작은 재사용 컴포넌트입니다.
const CategoryCircle = ({
  image,
  label,
  bgColor,
}: {
  image: string; // 표시할 이미지 경로
  label: string; // 표시할 카테고리 이름
  bgColor: string; // 배경색으로 사용할 Tailwind CSS 클래스
}) => (
  <div className="text-center flex flex-col items-center">
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center ${bgColor} relative overflow-hidden`}
    >
      <Image src={image} alt={label} width={60} height={60} objectFit="contain" />
    </div>
    <span className="mt-2 font-semibold dark:text-white">{label}</span>
  </div>
);

// 카테고리 섹션 전체를 담당하는 메인 컴포넌트입니다.
const CategorySection = () => {
  // API를 통해 받아온 카테고리 목록을 저장하기 위한 상태(state)입니다.
  // 초기값은 빈 배열이며, 데이터가 채워지면 화면이 다시 렌더링됩니다.
  const [categories, setCategories] = useState<Category[]>([]);
  // 전체보기 모드인지 여부를 저장하는 상태입니다.
  const [showAll, setShowAll] = useState(false);

  // 컴포넌트가 처음 화면에 그려질 때(mount) 딱 한 번만 실행되는 부분입니다.
  useEffect(() => {
    // 비동기로 동작하는 API 호출 함수를 실행하기 위한 내부 함수입니다.
    const getCategories = async () => {
      // API를 호출하여 카테고리 데이터를 받아옵니다.
      // fetchCategories에서 이미 bgColor가 포함된 Category[] 데이터를 반환합니다.
      const categoriesData = await fetchCategories();
      // 받아온 데이터로 categories 상태를 업데이트합니다.
      setCategories(categoriesData);
    };
    // 내부 함수를 호출합니다.
    getCategories();
  }, []); // 두 번째 인자인 배열이 비어있으면, 최초 렌더링 시에만 실행됩니다.

  // 전체보기 버튼 클릭 시 상태를 토글하는 함수입니다.
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center dark:text-white">
          Category
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </h2>
        <button 
          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
          onClick={toggleShowAll}
        >
          {showAll ? '접기' : '전체보기'}
        </button>
      </div>
      
      {/* 전체보기 모드에 따라 다른 레이아웃을 보여줍니다. */}
      {showAll ? (
        // 전체보기 모드: 4개씩 줄바꿈하여 그리드 형태로 표시
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCircle
              key={category.categoryId}
              image={category.categoryImageUrl}
              label={category.categoryName}
              bgColor={category.bgColor}
            />
          ))}
        </div>
      ) : (
        // 기본 모드: 스와이프 기능을 제공하는 Swiper 컴포넌트
        <Swiper
          spaceBetween={10} // 각 카테고리 아이콘(슬라이드) 사이의 간격을 10px로 설정합니다.
          slidesPerView={4} // 한 화면에 동시에 보여줄 아이콘(슬라이드)의 개수를 4개로 설정합니다.
          className="w-full"
        >
          {/* categories 상태에 저장된 배열을 순회하며 각 카테고리에 대한 슬라이드를 만듭니다. */}
          {categories.map((category) => (
            // 각 슬라이드는 고유한 key 값을 가져야 합니다. 여기서는 categoryId를 사용합니다.
            <SwiperSlide key={category.categoryId}>
              {/* 재사용 컴포넌트인 CategoryCircle에 필요한 정보(이미지, 이름, 배경색)를 전달합니다. */}
              <CategoryCircle
                image={category.categoryImageUrl}
                label={category.categoryName}
                bgColor={category.bgColor}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CategorySection; 