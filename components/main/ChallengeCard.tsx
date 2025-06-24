'use client';

import Image from 'next/image';

const ChallengeCard = ({
  image,
  location,
  title,
  progress,
}: {
  image: string;
  location: string;
  title: string;
  progress: string;
}) => (
  <div className="w-1/2 p-2">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-32 bg-gray-50 dark:bg-gray-700">
        <Image src={image} alt={title} layout="fill" objectFit="contain" />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">{location}</p>
        <h3 className="font-bold text-sm truncate dark:text-white">
          {title} [{progress}]
        </h3>
      </div>
    </div>
  </div>
);

export default ChallengeCard; 