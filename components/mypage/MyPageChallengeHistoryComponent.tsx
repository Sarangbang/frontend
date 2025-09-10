'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';
import Sidebar from '../common/Sidebar';
import BottomNav from '../common/BottomNav';
import Modal from '../common/Modal';
import type { MyPageApplication, ChallengeApplyStatus } from '@/types/MyPageApplication';
import { fetchMyApplications } from '@/lib/api/myApplication';

type TabType = 'pending' | 'approved' | 'rejected';

const statusMap: Record<TabType, ChallengeApplyStatus> = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
};


export default function MyPageChallengeHistoryComponent() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  
  // 서버 데이터 상태
  const [applications, setApplications] = useState<MyPageApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 모달 상태
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<MyPageApplication | null>(null);


  useEffect(() => {
    setIsClient(true);
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await fetchMyApplications();
        setApplications(data);
      } catch (e: any) {
        setLoadError(e?.message ?? '신청내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredApplications = applications.filter(
    (app) => app.challengeApplyStatus === statusMap[activeTab]
  );

  const getTabCount = (tab: TabType) =>
    applications.filter((app) => app.challengeApplyStatus === statusMap[tab]).length;

  const handleApplicationClick = (application: MyPageApplication) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleCommentClick = (application: MyPageApplication) => {
    setSelectedApplication(application);
    setShowCommentModal(true);
  };

  const handleEnterChallenge = () => {
    if (selectedApplication) {
      router.push(`/challenge/${selectedApplication.challengeId}`);
    }
  };

  const tabContent = (
    <>
      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'pending'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 border-b border-gray-200'
          }`}
        >
          대기 {getTabCount('pending')}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'approved'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 border-b border-gray-200'
          }`}
        >
          승인 {getTabCount('approved')}
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === 'rejected'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 border-b border-gray-200'
          }`}
        >
          거절 {getTabCount('rejected')}
        </button>
      </div>

      {/* 챌린지 목록 */}
      <div className="flex-1">
        {filteredApplications.length > 0 ? (
          <div className="space-y-4 p-4">
            {filteredApplications.map((application) => (
              <div key={application.applicationId} className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src= {application.imageUrl ?? '/images/charactors/gamza.png'}
                    alt={application.challengeDisplayTitle}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/charactors/gamza.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">
                    {application.location} · {application.location}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {application.challengeDisplayTitle}
                  </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleApplicationClick(application)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    신청서
                  </button>

                  {application.challengeApplyStatus !== 'PENDING' && application.comment && (
                    <button
                      onClick={() => handleCommentClick(application)}
                      className="px-3 py-1 bg-orange-500 text-white text-xs rounded-md"
                    >
                      방장 코멘트
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="text-center px-4">
              <Image
                src="/images/empty_box.png"
                alt="빈 챌린지 상태"
                className="mx-auto mb-4 w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px]"
                width={0}
                height={0}
              />
              <p className="text-gray-500 text-sm leading-relaxed">
                {{
                  pending: '챌린지 대기내역이 존재하지 않습니다',
                  approved: '챌린지 승인내역이 존재하지 않습니다',
                  rejected: '챌린지 거절내역이 존재하지 않습니다',
                }[activeTab]}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const mainContent = (
    <>
      <main className="flex-grow flex flex-col w-full">
        {tabContent}
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
                <header className="px-4 mb-6">
                  <h1 className="text-2xl font-medium dark:text-white">챌린지 신청내역</h1>
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
                <h1 className="text-xl font-medium dark:text-white">챌린지 신청내역</h1>
              </div>
            </header>
            {mainContent}
          </div>
        )}
      </div>

      {/* 신청서 모달 */}
      {showApplicationModal && selectedApplication && (
        <Modal 
          isOpen={showApplicationModal} 
          onClose={() => setShowApplicationModal(false)}
          title="신청서"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">자기소개</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedApplication.introduction}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">신청사유</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedApplication.reason}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">다짐</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedApplication.commitment}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* 방장 코멘트 모달 */}
      {showCommentModal && selectedApplication && selectedApplication.comment && (
        <Modal 
          isOpen={showCommentModal} 
          onClose={() => setShowCommentModal(false)}
          title="방장 코멘트"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">코멘트</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedApplication.comment}
              </p>
            </div>
            <button
              onClick={handleEnterChallenge}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              챌린지 입장하기
            </button>
          </div>
        </Modal>
      )}
    </>
  );
} 