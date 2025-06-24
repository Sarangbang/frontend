'use client';

import Image from 'next/image';

const CategoryCircle = ({
  image,
  label,
  bgColor,
}: {
  image: string;
  label: string;
  bgColor: string;
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

const CategorySection = () => (
  <div className="p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold flex items-center dark:text-white">
        Category
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </h2>
      <button className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">전체보기</button>
    </div>
    <div className="flex justify-around">
      <CategoryCircle
        image="/images/charactors/image 25.png"
        label="운동/건강"
        bgColor="bg-gray-100 dark:bg-gray-700"
      />
      <CategoryCircle
        image="/images/charactors/image 23.png"
        label="기상/루틴"
        bgColor="bg-yellow-100 dark:bg-yellow-900"
      />
      <CategoryCircle
        image="/images/charactors/image 24.png"
        label="학습/독서"
        bgColor="bg-blue-100 dark:bg-blue-900"
      />
    </div>
  </div>
);

export default CategorySection; 