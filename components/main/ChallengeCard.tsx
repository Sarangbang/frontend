'use client';

import Image from 'next/image';

interface ChallengeCardProps {
  image: string;
  location: string;
  title: string;
  progress: string;
}

const ChallengeCard = ({ image, location, title, progress }: ChallengeCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
    <div className="relative h-32 bg-gray-50 dark:bg-gray-700">
      <Image 
        src={image || '/images/charactors/gamza.png'} 
        alt={title} 
        layout="fill" 
        objectFit="cover" 
        onError={(e) => { e.currentTarget.src = '/images/charactors/gamza.png'; }}
      />
    </div>
    <div className="p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">{location}</p>
      <h3 className="font-bold text-sm truncate dark:text-white">
        {title} [{progress}]
      </h3>
    </div>
  </div>
);

export default ChallengeCard; 