'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

interface ContentHeaderProps {
  title: string;
  isDesktop: boolean;
  isClient: boolean;
  children?: React.ReactNode;
}

const ContentHeader = ({
  title,
  isDesktop,
  isClient,
  children,
}: ContentHeaderProps) => {
  const router = useRouter();

  if (isClient && isDesktop) {
    return (
      <div className="pt-8 mb-8 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium dark:text-white">{title}</h1>
          <div className="flex items-center space-x-4">
            {children}
            <div className="w-10 h-10 relative">
              <Image
                src="/images/charactors/gamza.png"
                alt="Profile"
                fill
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-2">
            <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
          <h1 className="text-xl font-medium dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {children}
          <div className="w-8 h-8 relative">
            <Image
              src="/images/charactors/gamza.png"
              alt="Profile"
              fill
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ContentHeader; 