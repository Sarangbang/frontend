'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Header from './Header';
import Banner from './Banner';
import CategorySection from './CategorySection';
import PopularChallengeSection from './PopularChallengeSection';
import BottomNav from '../common/BottomNav';
import Sidebar from '../common/Sidebar';
import Logout from '../common/Logout';

export default function MainClient() {
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isLoggedIn && (
        <div className="fixed top-6 right-8 z-50">
          <Logout onLogout={() => setIsLoggedIn(false)} />
        </div>
      )}
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