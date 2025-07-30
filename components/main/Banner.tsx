'use client';

import Image from 'next/image';

const Banner = () => (
    <div className="bg-[#FFF9E9] dark:bg-gray-800 p-6 relative h-48 flex flex-col justify-center ">
        <Image
            src="/images/town.png"
            alt="banner background"
            layout="fill"
            className="opacity-20 object-contain object-right-bottom"
        />
        <div className="relative">
            <p className="text-base md:text-xl lg:text-2xl dark:text-white">같은 동네, 같은 마음</p>
            <p className="text-xl md:text-3xl lg:text-4xl font-medium dark:text-white">함께 만드는 습관</p>
            <p className="mt-2 text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300">동네 친구들과 함께 챌린지하고, 함께 모여요!</p>
        </div>
    </div>
);

export default Banner; 