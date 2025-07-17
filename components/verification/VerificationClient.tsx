'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '@/components/common/Sidebar';
import BottomNav from '@/components/common/BottomNav';
import VerifiableChallengeCard from './VerifiableChallengeCard';
import ContentHeader from '../common/ContentHeader';
import Tabs, { type Tab } from '../common/Tabs';
import CompletedVerificationsClient from './CompletedVerificationsClient';

const mockVerifiableChallenges = [
  { id: 1, location: '용인시/중동', title: '책..읽읍시다', currentParticipants: 4, maxParticipants: 10, image: '/images/charactors/default_wakeup.png', isVerified: false },
  { id: 2, location: '용인시/중동', title: '6시 기상 챌린지', currentParticipants: 2, maxParticipants: 5, image: '/images/charactors/default_wakeup.png', isVerified: true },
  { id: 3, location: '용인시/중동', title: '책..읽읍시다', currentParticipants: 4, maxParticipants: 10, image: '/images/charactors/default_wakeup.png', isVerified: true },
];

const VERIFICATION_TABS: Tab<'챌린지 인증' | '인증완료 내역'>[] = [
  { id: '챌린지 인증', label: '챌린지 인증' },
  { id: '인증완료 내역', label: '인증완료 내역' },
];

const VerificationClient = () => {
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
            <input type="text" placeholder="참여중인 챌린지 검색" className="w-full pl-4 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">전체 챌린지 ({mockVerifiableChallenges.length})</p>
          {mockVerifiableChallenges.map(challenge => (
            <VerifiableChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      );
    }

    if (activeTab === '인증완료 내역') {
      return <CompletedVerificationsClient />;
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
            <main className="w-full max-w-2xl mx-auto">
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