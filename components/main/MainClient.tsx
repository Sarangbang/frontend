'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Header from './Header';
import Banner from './Banner';
import CategorySection from './CategorySection';
import PopularChallengeSection from './PopularChallengeSection';
import BottomNav from '../common/BottomNav';
import Sidebar from '../common/Sidebar';

export default function MainClient() {
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isClient && isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="w-2/4 mx-auto pt-8">
              <Banner />
              <CategorySection />
              <PopularChallengeSection />
            </main>
          </div>
        </div>
      ) : (
        <div className="pt-16 pb-16">
          <Header />
          <main>
            <Banner />
            <CategorySection />
            <PopularChallengeSection />
          </main>
          <BottomNav />
        </div>
      )}
    </div>
  );
} 