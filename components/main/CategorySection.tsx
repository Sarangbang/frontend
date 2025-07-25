'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { fetchCategories } from '@/api/category';
import type { CategoryDto } from '@/types/Category';

const CategoryCircle = ({
  image,
  label,
  categoryId,
  onClick,
}: {
  image: string;
  label:string;
  categoryId: number;
  onClick: (categoryId: number) => void;
}) => (
  <div
    className="w-24 h-24 rounded-full relative flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-700 transition-transform hover:scale-105"
    onClick={() => onClick(categoryId)}
  >
    <Image 
      src={image} 
      alt={label} 
      layout="fill"
      objectFit="cover"
      className="opacity-40 dark:opacity-30"
      onError={(e) => { e.currentTarget.src = '/images/charactors/default_general.png'; }}
    />
    <span className="font-medium text-gray-800 dark:text-white z-10 relative text-center">
      {label}
    </span>
  </div>
);

const CategorySection = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesData = await fetchCategories();
      
      const allCategory: CategoryDto = {
        categoryId: 0,
        categoryName: '전체',
        categoryImageUrl: '/images/charactors/category_all.png',
      };
      
      setCategories([allCategory, ...categoriesData]);
    };
    getCategories();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleCategoryClick = (categoryId: number) => {
    if (categoryId === 0) {
      router.push('/challenges/all');
    } else {
      router.push(`/challenges/all?categoryId=${categoryId}`);
    }
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4 px-4">
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
      
      {showAll ? (
        <div className="grid grid-cols-4 gap-4 px-4">
          {categories.map((category) => (
            <div key={category.categoryId} className="flex justify-center">
              <CategoryCircle
                image={category.categoryImageUrl}
                label={category.categoryName}
                categoryId={category.categoryId}
                onClick={handleCategoryClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView="auto"
          className="w-full pl-4"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.categoryId} style={{ width: 'auto' }}>
              <CategoryCircle
                image={category.categoryImageUrl}
                label={category.categoryName}
                categoryId={category.categoryId}
                onClick={handleCategoryClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CategorySection; 