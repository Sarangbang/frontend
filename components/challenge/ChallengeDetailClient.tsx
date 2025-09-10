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
import { fetchChallengeDetail, getDailyMessage } from '@/lib/api/challenge';
import {
  getVerificationsByDate,
  cancelVerification,
} from '@/lib/api/challengeVerification';
import type {
  ChallengeDetail,
  ChallengeVerificationByDate,
} from '@/types/Challenge';
import { useUserStore } from '@/lib/store/userStore';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const ChallengeDetailClient = ({ challengeId }: { challengeId: BigInt }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('멤버');

  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<ChallengeVerificationByDate | null>(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [verificationList, setVerificationList] = useState<
    ChallengeVerificationByDate[]
  >([]);
  const [isMaster, setIsMaster] = useState(false); // 방장 여부
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [challengeTitle, setChallengeTitle] = useState<string>('');
  const [challengeMethod, setChallengeMethod] = useState<string>('');
  const [dailyMessage, setDailyMessage] = useState<string>('오늘은 한 문제, 테스트 그린불 찍고 하루 마무리! 💻✅');

  const user = useUserStore(state => state.user);

  const isToday = () => {
    const today = new Date();
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getDate() === today.getDate()
    );
  };

  useEffect(() => {
    if (challengeId) {
      const loadChallengeDetails = async () => {
        try {
          const details = await fetchChallengeDetail(Number(challengeId));
          setChallenge(details);
          setChallengeTitle(details.title);
          setChallengeMethod(details.method);
        } catch (error) {
          toast.error('챌린지 정보를 불러오는데 실패했습니다.');
        }
      };
      loadChallengeDetails();
    }
  }, [challengeId]);

  useEffect(() => {
    setIsClient(true);
    const tab = searchParams.get('tab');
    if (tab === 'photo' || tab === '사진') {
      setActiveTab('사진');
    }

    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('verificationSuccess')
    ) {
      toast.success('인증이 등록되었습니다');
      localStorage.removeItem('verificationSuccess');
    }

    if (challengeId && currentDate) {
      fetchVerifications();
      fetchDailyMessage();
    }
  }, [challengeId, currentDate, searchParams, user?.uuid]);

  const fetchDailyMessage = async () => {
    try {
      const message = await getDailyMessage(Number(challengeId));
      setDailyMessage(message);
      console.log('나왔어요?', message);
    } catch (error) {
      console.error('오늘의 한 마디를 불러오는데 실패했습니다:', error);
      // 에러가 발생해도 기본 메시지는 유지
    }
  };

  const fetchVerifications = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const data = await getVerificationsByDate(challengeId, dateStr);

      if (user?.uuid) {
        const currentUserVerification = data.find(v => v.userId === user.uuid);
        setIsMaster(currentUserVerification?.role === 'owner');
        setIsVerified(currentUserVerification?.status === 'APPROVED');
      } else {
        setIsMaster(false);
        setIsVerified(false);
      }

      setVerificationList(data);
    } catch (error) {
      toast.error('인증 정보를 불러오는데 실패했습니다.');
      setVerificationList([]);
    }
  };

  const handleCancelVerification = async (userId: string) => {
    if (
      window.confirm(
        '삭제된 인증사진은 복구할 수 없습니다. 정말 삭제하시겠습니까?',
      )
    ) {
      try {
        const verification = verificationList.find(v => v.userId === userId);
        if (!verification || !verification.verifiedAt) {
          toast.error('인증 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await cancelVerification({
          challengeId: Number(challengeId),
          userId,
          verifiedAt: verification.verifiedAt.split('T')[0],
        });
        toast.success(response.message || '인증이 취소되었습니다.');
        fetchVerifications();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || '인증 취소에 실패했습니다.',
        );
      }
    }
  };

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;

  const handleVerificationClick = () => {
    if (!isVerified) {
      router.push(`/verification/${challengeId}`);
    }
  };

  const openImageOverlay = (member: ChallengeVerificationByDate) => {
    if (member.imgUrl) {
      setSelectedMember(member);
    }
  };

  const closeImageOverlay = () => {
    setSelectedMember(null);
  };

  let isUpcoming = false;
  if (challenge) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);
    isUpcoming = startDate > today;
  }

  const isPrevButtonDisabled =
    !challenge ||
    new Date(currentDate).setHours(0, 0, 0, 0) <=
      new Date(challenge.startDate).setHours(0, 0, 0, 0);

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

      {isUpcoming ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            아직 시작되지 않은 챌린지입니다.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center my-6 px-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 1);
                setCurrentDate(newDate);
              }}
              disabled={isPrevButtonDisabled}
            >
              <ChevronLeftIcon
                className={`w-6 h-6 ${
                  isPrevButtonDisabled
                    ? 'text-gray-300 dark:text-gray-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </button>
            <p className="text-lg font-semibold dark:text-white">
              {formattedDate}
            </p>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 1);
                setCurrentDate(newDate);
              }}
              disabled={isToday()}
            >
              <ChevronRightIcon
                className={`w-6 h-6 ${
                  isToday()
                    ? 'text-gray-300 dark:text-gray-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </button>
          </div>
          <div className="p-4 flex-1">
            {activeTab === '멤버' && (
              <div>
                                                  {/* 오늘의 한 마디 섹션 */}
                 <div className="mb-12">
                   <h3 className="text-lg font-semibold text-center mb-6 dark:text-white">
                     오늘의 한 마디
                   </h3>
                                        <div className="flex items-center gap-6">
                       <div className="flex-shrink-0">
                         <Image
                           src="/images/cheerup-potato.png"
                           alt="응원하는 감자"
                           width={96}
                           height={96}
                           className="w-24 h-24 object-contain"
                         />
                       </div>
                                               <div className="flex-1 min-h-[96px] bg-[#FEEDC9] rounded-2xl p-5 flex items-center justify-center shadow-sm border border-yellow-200/30">
                          <p className="text-gray-700 text-center text-base font-medium">
                            {dailyMessage}
                          </p>
                        </div>
                     </div>
                 </div>
                 
                 {/* 구분선 */}
                 <div className="border-t border-gray-200 dark:border-gray-600 mb-8"></div>
                 
                 {/* 멤버 섹션 제목 */}
                 <div className="mb-6">
                   <h3 className="text-lg font-semibold text-center dark:text-white">
                     일심 감자들
                   </h3>
                 </div>
                 
                 {/* 멤버 그리드 */}
                 <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-8 text-center mb-12">
                   {verificationList.map(member => (
                     <div
                       key={member.userId}
                       className="flex flex-col items-center"
                     >
                       <div
                         onClick={() => openImageOverlay(member)}
                         className={`relative w-24 h-24 rounded-full border-4 ${
                           member.status === 'APPROVED'
                             ? 'border-blue-500'
                             : 'border-red-500'
                         } ${member.imgUrl ? 'cursor-pointer' : ''}`}
                       >
                         <Image
                           src={
                             member.status === 'APPROVED'
                               ? '/images/expressions/smile.png'
                               : '/images/expressions/sad.png'
                           }
                           alt={member.nickname}
                           layout="fill"
                           className="rounded-full object-cover"
                         />
                       </div>
                       <p className="mt-3 font-semibold dark:text-white text-sm">
                         {member.nickname}
                       </p>
                     </div>
                   ))}
                 </div>
                 
                 {/* 구분선 */}
                 <div className="border-t border-gray-200 dark:border-gray-600 mb-8"></div>
                 
                 {/* 인증 방법 영역 */}
                 <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 text-center">
                   <div className="font-bold text-lg mb-2">! 인증 방법 !</div>
                   <div className="text-sm text-gray-700 dark:text-gray-300">
                     {(challengeMethod || '인증 방법 정보가 없습니다.')
                       .split('\n')
                       .map((line, idx) => (
                         <span key={idx}>
                           {line}
                           <br />
                         </span>
                       ))}
                   </div>
                 </div>
              </div>
            )}
            {activeTab === '사진' && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4 pt-4">
                {verificationList.map(member => (
                  <div key={member.userId} className="text-center">
                    {member.imgUrl ? (
                      <div
                        className="relative w-full h-48 cursor-pointer"
                        onClick={() => openImageOverlay(member)}
                      >
                        <Image
                          src={member.imgUrl}
                          alt={`${member.nickname}의 인증 사진`}
                          layout="fill"
                          className="object-cover rounded-lg"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/charactors/gamza.png';
                          }}
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
                      {isToday() &&
                        member.status &&
                        member.imgUrl &&
                        (isMaster || user?.uuid === member.userId) && (
                          <button
                            onClick={() =>
                              handleCancelVerification(member.userId)
                            }
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
        </>
      )}

      {activeTab === '멤버' && !isUpcoming && (
        <div className="p-4 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            onClick={handleVerificationClick}
            disabled={!isToday() || isVerified}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg ${
              !isToday()
                ? 'bg-gray-400'
                : isVerified
                ? 'bg-gray-400'
                : 'bg-orange-500'
            }`}
          >
            {!isToday()
              ? '인증 불가'
              : isVerified
              ? '인증완료'
              : '챌린지 인증'}
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
              <button
                onClick={() => router.back()}
                className="mr-4 absolute left-0"
              >
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
                src={selectedMember.imgUrl!}
                alt={`${selectedMember.nickname}의 인증 사진`}
                width={500}
                height={500}
                className="w-full h-auto object-contain rounded-lg"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/charactors/gamza.png';
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-gray-800 dark:text-gray-200">
                {selectedMember.content || ''}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedMember.verifiedAt
                  ? new Date(selectedMember.verifiedAt).toLocaleString('ko-KR')
                  : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetailClient; 