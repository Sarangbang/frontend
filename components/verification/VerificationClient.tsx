'use client';

import { useState, useEffect } from 'react';
import { getTodayVerifications } from '@/api/verification';
import type { TodayVerificationStatusResponse } from '@/types/Verification';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '@/components/common/Sidebar';
import BottomNav from '@/components/common/BottomNav';
import VerifiableChallengeCard from './VerifiableChallengeCard';
import ContentHeader from '../common/ContentHeader';
import Tabs, { type Tab } from '../common/Tabs';

import { getChallengeStatus } from '@/util/dateUtils';

import CompletedVerificationsClient from './CompletedVerificationsClient';



const VERIFICATION_TABS: Tab<'챌린지 인증' | '인증완료 내역'>[] = [
  { id: '챌린지 인증', label: '챌린지 인증' },
  { id: '인증완료 내역', label: '인증완료 내역' },
];

const VerificationClient = () => {
  const [activeTab, setActiveTab] =
    useState<'챌린지 인증' | '인증완료 내역'>('챌린지 인증');
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [verifiableChallenges, setVerifiableChallenges] = useState<TodayVerificationStatusResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTodayVerifications();
        setVerifiableChallenges(data);
      } catch (err) {
        setError('챌린지 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // ChallengeSummaryResponse -> VerifiableChallenge 변환
  const toVerifiableChallenge = (challenge: TodayVerificationStatusResponse) => ({
    id: challenge.challengeId,
    location: challenge.location,
    title: challenge.title,
    currentParticipants: challenge.currentParticipants,
    maxParticipants: challenge.participants,
    image: challenge.image,
    verifyStatus: challenge.verifyStatus,
    startDate: challenge.startDate,
    endDate: challenge.endDate,
  });

  const renderContent = () => {
    if (activeTab === '챌린지 인증') {
      return (
        <div>
          <div className="relative my-4">
            <input type="text" placeholder="참여중인 챌린지 검색" className="w-full pl-4 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-8">로딩 중...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              {verifiableChallenges.length === 0 ? (
                <div className="text-center text-gray-400 py-8">참여 중인 챌린지가 없습니다.</div>
              ) : (
                verifiableChallenges
                  .filter(challenge => getChallengeStatus(challenge.startDate, challenge.endDate) === '진행중')
                  .map(challenge => (
                    <VerifiableChallengeCard key={challenge.challengeId} challenge={toVerifiableChallenge(challenge)} />
                  ))
              )}
            </>
          )}
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