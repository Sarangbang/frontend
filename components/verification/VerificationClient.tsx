'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Sidebar from '@/components/common/Sidebar';
import BottomNav from '@/components/common/BottomNav';
import VerifiableChallengeCard from './VerifiableChallengeCard';
import ContentHeader from '../common/ContentHeader';
import Tabs, { type Tab } from '../common/Tabs';

const mockVerifiableChallenges = [
  { id: 1, location: '용인시/중동', title: '책..읽읍시다', currentParticipants: 4, maxParticipants: 10, image: '/images/charactors/default_wakeup.png', isVerified: false },
  { id: 2, location: '용인시/중동', title: '6시 기상 챌린지', currentParticipants: 2, maxParticipants: 5, image: '/images/charactors/default_wakeup.png', isVerified: true },
  { id: 3, location: '용인시/중동', title: '책..읽읍시다', currentParticipants: 4, maxParticipants: 10, image: '/images/charactors/default_wakeup.png', isVerified: true },
];

const mockVerifiedImages = [
  { id: 1, src: '/images/charactors/default_wakeup.png', title: '책..읽읍시다', date: '2025-06-20' },
  { id: 2, src: '/images/charactors/default_wakeup.png', title: '6시 기상 챌린지', date: '2025-06-18' },
  { id: 3, src: '/images/charactors/default_wakeup.png', title: '책..읽읍시다', date: '2025-06-12' },
  { id: 4, src: '/images/charactors/default_wakeup.png', title: '책..읽읍시다', date: '2025-06-11' },
  { id: 5, src: '/images/charactors/default_wakeup.png', title: '6시 기상 챌린지', date: '2025-06-10' },
];

const VERIFICATION_TABS: Tab<'챌린지 인증' | '인증완료 내역'>[] = [
  { id: '챌린지 인증', label: '챌린지 인증' },
  { id: '인증완료 내역', label: '인증완료 내역' },
];

const VerificationClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<'챌린지 인증' | '인증완료 내역'>('챌린지 인증');
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderContent = () => {
    if (activeTab === '챌린지 인증') {
      return (
        <div>
          <div className="relative my-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="참여중인 챌린지 검색" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">전체 챌린지 ({mockVerifiableChallenges.length})</p>
          {mockVerifiableChallenges.map(challenge => (
            <VerifiableChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      );
    }

    if (activeTab === '인증완료 내역') {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {mockVerifiedImages.map(item => (
            <div key={item.id} className="relative aspect-square">
              <Image src={item.src} alt={item.title} layout="fill" className="object-cover rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg">
                <p className="text-sm font-bold truncate">{item.title}</p>
                <p className="text-xs">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const mainContent = (
    <div className="dark:bg-gray-900">
      <Tabs
        tabs={VERIFICATION_TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="p-4">{renderContent()}</div>
    </div>
  );

  if (!isClient) return null;

  return (
    <>
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="w-2/4 mx-auto">
              <ContentHeader
                title="Challenge"
                isDesktop={isDesktop}
                isClient={isClient}
              />
              {mainContent}
            </main>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 pb-24">
          <ContentHeader
            title="Challenge"
            isDesktop={isDesktop}
            isClient={isClient}
          />
          {mainContent}
          <BottomNav />
        </div>
      )}
    </>
  );
};

export default VerificationClient; 