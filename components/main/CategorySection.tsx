'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { fetchCategories } from '@/api/category';
import type { Category, CategoryDto } from '@/types/Category';
import { FreeMode, Pagination } from 'swiper/modules';

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

const addBgColorsToCategories = (data: CategoryDto[]): Category[] => {
  return data.map((dto, index) => ({
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    categoryImageUrl: dto.categoryImageUrl,
    bgColor: bgColors[index % bgColors.length],
  }));
};

const CategoryCircle = ({
  image,
  label,
  bgColor,
  categoryId,
  onClick,
}: {
  image: string;
  label: string;
  bgColor: string;
  categoryId: number;
  onClick: (categoryId: number) => void;
}) => (
  <div 
    className="text-center flex flex-col items-center cursor-pointer"
    onClick={() => onClick(categoryId)}
  >
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center ${bgColor} relative overflow-hidden transition-transform hover:scale-105`}
    >
      <Image src={image} alt={label} width={60} height={60} objectFit="contain" />
    </div>
    <span className="mt-2 font-semibold dark:text-white">{label}</span>
  </div>
);

const CategorySection = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesData = await fetchCategories();
      const categoriesWithBgColor = addBgColorsToCategories(categoriesData);
      
      // "전체" 카테고리를 맨 앞에 추가
      const allCategory: Category = {
        categoryId: 0,
        categoryName: '전체',
        categoryImageUrl: '/images/charactors/gamza.png', // 기존 이미지 재사용
        bgColor: 'bg-gray-100 dark:bg-gray-700',
      };
      
      setCategories([allCategory, ...categoriesWithBgColor]);
    };
    getCategories();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: number) => {
    if (categoryId === 0) {
      // "전체" 카테고리 클릭 시 새로운 챌린지 조회 페이지로 이동
      router.push('/challenges/all');
    } else {
      // 특정 카테고리 클릭 시 해당 카테고리로 필터링된 페이지로 이동
      router.push(`/challenges/all?categoryId=${categoryId}`);
    }
  };
  const swiperRef = useRef<any>(null);


  return (
    <>
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
        // grid-cols-4로 한 줄에 4개씩, gap-4로 간격을 줍니다.
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))]">
          {categories.map((category) => (
            <CategoryCircle
              key={category.categoryId}
              image={category.categoryImageUrl}
              label={category.categoryName}
              bgColor={category.bgColor}
              categoryId={category.categoryId}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      ) : (
        // 기본 모드: 스와이프 형태로 표시
        <Swiper
        modules={[FreeMode]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onResize={() => swiperRef.current?.update()}
        observer={true}
        observeParents={true}
        slidesPerView="auto"
        freeMode
        spaceBetween={16}
      >
          {categories.map((category) => (
            <SwiperSlide key={category.categoryId} style={{ width: 'clamp(4rem,12vw,6rem)' }}>

              {/* <div className="w-24"> */}
                <CategoryCircle
                  image={category.categoryImageUrl}
                  label={category.categoryName}
                  bgColor={category.bgColor}
                  categoryId={category.categoryId}
                  onClick={handleCategoryClick}
                />
              {/* </div> */}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

    </div>
    {/* 이곳에 스와이프를 적용해줘  categories*/}

    </>
  );
};

export default CategorySection; 