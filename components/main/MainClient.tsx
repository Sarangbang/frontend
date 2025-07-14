'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Banner from './Banner';
import CategorySection from './CategorySection';
import PopularChallengeSection from './PopularChallengeSection';
import BottomNav from '../common/BottomNav';
import Sidebar from '../common/Sidebar';

export default function MainClient() {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    
    const handleResize = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="max-w-4xl mx-auto px-4 py-8">
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