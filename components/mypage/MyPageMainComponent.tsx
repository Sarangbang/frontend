'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { getUserProfile } from '@/lib/api/mypage';
import { UserProfileResponse } from '@/types/User';
import Sidebar from '../common/Sidebar';
import BottomNav from '../common/BottomNav';

export default function MyPageMainComponent() { 
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error('사용자 정보를 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileClick = () => {
    router.push('/mypage/profile');
  };

  const handleChallengeHistoryClick = () => {
    router.push('/mypage/challenge-history');
  };

  const mainContent = (
    <>
      <main className="flex-grow flex flex-col w-full px-4 py-6 space-y-6">
        {/* 사용자 프로필 카드 */}
        <div 
          className="w-full bg-gray-50 rounded-2xl p-4 cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={userProfile?.profileImageUrl || '/images/charactors/gamza.png'}
                  alt="Profile"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userProfile?.nickname || '로딩중...'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userProfile?.email || '로딩중...'}
                </p>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        {/* 배너 이미지 */}
        <div className="-mx-4 bg-[#FFFAE5] flex justify-center">
          <Image
            src="/images/mypage/mypage_banner.png"
            alt="마이페이지 배너"
            width={420}
            height={120}
            className="w-full h-auto max-w-[420px]"
            priority
          />
        </div>

        {/* 챌린지 신청내역 메뉴 */}
        <div 
          className="w-full bg-white rounded-2xl p-4 cursor-pointer"
          onClick={handleChallengeHistoryClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                챌린지 신청내역
              </span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </main>
      {isClient && !isDesktop && <BottomNav />}
    </>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {isClient && isDesktop ? (
          <div className="flex">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
              <div className="max-w-2xl mx-auto py-8">
                <header className="px-4">
                  <h1 className="text-2xl font-medium dark:text-white">MyPage</h1>
                </header>
                {mainContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 flex flex-col min-h-screen">
            <header className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <button onClick={() => router.back()}>
                  <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                </button>
                <h1 className="text-xl font-medium dark:text-white">MyPage</h1>
              </div>
            </header>
            {mainContent}
          </div>
        )}
      </div>
    </>
  );
} 