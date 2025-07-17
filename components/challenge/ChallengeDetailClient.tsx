'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '../common/Sidebar';
import getChallengeMembers from '@/api/getChallengeMembers';
import type { Member } from '@/types/Member';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const ChallengeDetailClient = ({ challengeId }: { challengeId: BigInt }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('멤버');

  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [isMaster, setIsMaster] = useState(true); // 방장 여부 (임시)
  const [challengeTitle, setChallengeTitle] = useState<string>('');
  const [challengeMethod, setChallengeMethod] = useState<string>('');

  // 오늘 날짜인지 판별하는 함수
  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getDate() === today.getDate()
    );
  };

  useEffect(() => {
    setIsClient(true);
    // 쿼리 파라미터로 탭 제어
    const tab = searchParams.get('tab');
    if (tab === 'photo' || tab === '사진') {
      setActiveTab('사진');
    }

    if (typeof window !== 'undefined' && localStorage.getItem('verificationSuccess')) {
        toast.success('인증이 등록되었습니다');
        localStorage.removeItem('verificationSuccess');
      }
    
    if(challengeId) {
    if (challengeId && currentDate) {
      const fetchMembers = async () => {
        const dateStr = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
        const data = await getChallengeMembers(challengeId, dateStr);
        setMemberList(
          data.map((member: Member) => ({
            id: member.id,
            nickname: member.nickname,
            role: member.role,
            title: member.challengeTitle,
            method: member.challengeMethod,
            status: member.status,
          })),
        );
        // challengeTitle, challengeMethod 추출 (첫 번째 멤버 기준)
        if (data.length > 0) {
          if (data[0].challengeTitle) setChallengeTitle(data[0].challengeTitle);
          if (data[0].challengeMethod) setChallengeMethod(data[0].challengeMethod);
        }
      };
      fetchMembers();
    }
  }}, [challengeId, currentDate, searchParams]);

  const handleCancelVerification = (memberId: number) => {
    setMemberList(currentMembers =>
      currentMembers.map(member =>
        member.id === memberId ? { ...member, verified: false } : member,
      ),
    );
  };

  const formattedDate = currentDate
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '.');

  const handleVerificationClick = () => {
    if (!isVerified) {
      router.push(`/verification/${challengeId}`);
    }
  };

  const openImageOverlay = (member: Member) => {
    if (member.imageUrl) {
      setSelectedMember(member);
    }
  };

  const closeImageOverlay = () => {
    setSelectedMember(null);
  };

  const challengeContent = (
    <>
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-3 text-center text-lg font-semibold ${
            activeTab === '멤버'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-gray-400 dark:text-gray-500'
          }`}
          onClick={() => setActiveTab('멤버')}
        >
          멤버
        </button>
        <button
          className={`flex-1 py-3 text-center text-lg font-semibold ${
            activeTab === '사진'
              ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
              : 'text-gray-400 dark:text-gray-500'
          }`}
          onClick={() => setActiveTab('사진')}
        >
          사진
        </button>
      </div>

      <div className="p-4 flex-1">
        {activeTab === '멤버' && (
          <div>
            <div className="flex justify-between items-center my-6">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() - 1)),
                  )
                }
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <p className="text-lg font-semibold dark:text-white">
                {formattedDate}
              </p>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() + 1)),
                  )
                }
                disabled={isToday()}
              >
                <ChevronRightIcon className={`w-6 h-6 ${isToday() ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`} />
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-6 text-center">
              {memberList.map(member => (
                <div key={member.id} className="flex flex-col items-center">
                  <div
                    onClick={() => openImageOverlay(member)}
                    className={`relative w-24 h-24 rounded-full border-4 ${
                      member.status ? 'border-blue-500' : 'border-red-500'
                    } ${member.imageUrl ? 'cursor-pointer' : ''}`}
                  >
                    <Image
                      src={
                        member.status
                          ? '/images/expressions/smile.png'
                          : '/images/expressions/sad.png'
                      }
                      alt={member.nickname}
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="mt-2 font-semibold dark:text-white text-sm">
                    {member.nickname}
                  </p>
                </div>
              ))}
            </div>
            {/* 인증 방법 영역 추가 */}
            <div className="mt-15">
              <div className="bg-gray-100 text-gray-800 rounded-md p-4 text-center">
                <div className="font-bold text-lg mb-2">⭐ 인증 방법 ⭐</div>
                <div className="text-sm">
                  {(challengeMethod || '인증 방법 정보가 없습니다.').split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === '사진' && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4 pt-4">
            {memberList.map(member => (
              <div key={member.id} className="text-center">
                {member.imageUrl ? (
                  <div
                    className="relative w-full h-48 cursor-pointer"
                    onClick={() => openImageOverlay(member)}
                  >
                    <Image
                      src={member.imageUrl}
                      alt={`${member.nickname}의 인증 사진`}
                      layout="fill"
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500">인증 미완료</p>
                  </div>
                )}
                {/* <div className="flex justify-center items-center gap-2 mt-2"> */}
                <div className="flex justify-between gap-2 mt-2">
                  <p className="font-semibold dark:text-white">
                    {member.nickname}
                  </p>
                  {isMaster && member.status && member.imageUrl && (
                    <button
                      onClick={() => handleCancelVerification(member.id)}
                      className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm font-semibold hover:bg-orange-600"
                    >
                      인증취소
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === '멤버' && (
        <div className="p-4 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            onClick={handleVerificationClick}
            disabled={!isToday() || isVerified}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg ${
              !isToday() ? 'bg-gray-400' : isVerified ? 'bg-gray-400' : 'bg-orange-500'
            }`}
          >
            {!isToday() ? '인증 불가' : isVerified ? '인증완료' : '챌린지 인증'}
          </button>
        </div>
      )}
    </>
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="w-2/4 mx-auto pt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-center items-center">
                    <h1 className="text-xl font-bold dark:text-white text-center w-full">
                      {challengeTitle || '챌린지'}
                    </h1>
                  </div>
                </header>
                {challengeContent}
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen flex flex-col">
          <header className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-center items-center">
              <button onClick={() => router.back()} className="mr-4 absolute left-0">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
              <h1 className="text-xl font-bold dark:text-white text-center w-full">
                {challengeTitle || '챌린지'}
              </h1>
            </div>
          </header>
          {challengeContent}
        </div>
      )}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
          onClick={closeImageOverlay}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm mx-auto p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center relative">
              <div className="flex-1"></div>
              <h3 className="text-xl font-bold dark:text-white absolute left-1/2 transform -translate-x-1/2">
                {selectedMember.nickname}
              </h3>
              <button
                onClick={closeImageOverlay}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                <XMarkIcon className="w-7 h-7 cursor-pointer hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-bold" />
              </button>
            </div>
            <div>
              <Image
                src={selectedMember.imageUrl!}
                alt={`${selectedMember.nickname}의 인증 사진`}
                width={500}
                height={500}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-800 dark:text-gray-200">
                #헬스의정석 #헬창의삶
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                2025-06-20 15:36
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetailClient; 