'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createChallenge, getPopularChallenges } from '@/api/challenge';
import { PopularChallengeResponse, ChallengeCreateRequest, ChallengeFormData } from '@/types/Challenge';
import { ChevronLeftIcon, ClockIcon, UserGroupIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { calculatePeriod, formatPeriod, getChallengeStatus, formatDateToYYYYMMDD, calculateEndDateObject } from '@/util/dateUtils';
import Image from 'next/image';
import ChallengeApplyModal from './ChallengeApplyModal';
import CreateChallengeForm from './CreateChallengeForm';
import { useMediaQuery } from "react-responsive";
import Sidebar from '../common/Sidebar';

const PopularChallengeItem = ({ challenge, onClick }: { challenge: PopularChallengeResponse; onClick: () => void; }) => {
    const periodDays = calculatePeriod(challenge.startDate, challenge.endDate);
    const formattedPeriod = formatPeriod(periodDays);
    const status = getChallengeStatus(challenge.startDate, challenge.endDate);

    const getStatusChipStyle = (status: '예정' | '진행중' | '종료') => {
        switch (status) {
          case '예정':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700';
          case '진행중':
            return 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700';
          case '종료':
            return 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
          default:
            return 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
        }
    };
    
    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 cursor-pointer transition-all hover:shadow-md"
            onClick={onClick}
        >
            <div className="flex">
                <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                    <Image
                        src={challenge.image || '/images/charactors/gamza.png'}
                        alt={challenge.challengeTitle}
                        width={96}
                        height={96}
                        className="rounded-full object-cover aspect-square"
                        onError={(e) => {
                            e.currentTarget.src = '/images/charactors/gamza.png';
                        }}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipStyle(status)}`}>
                            {status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{challenge.region} · {challenge.categoryName}</p>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white my-1">{challenge.challengeTitle} [{challenge.currentParticipants}/{challenge.maxParticipants}]</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1.5" />
                            <span>기간: {formattedPeriod}</span>
                        </div>
                        <div className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1.5" />
                            <span>참여자: {challenge.currentParticipants}/{challenge.maxParticipants}명</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1.5" />
                            <span>시작일: {challenge.startDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const PopularChallengesClient = () => {
    const router = useRouter();
    const [challenges, setChallenges] = useState<PopularChallengeResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('popular');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
    const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

    const fetchPopularChallenges = async () => {
        try {
            const data = await getPopularChallenges();
            setChallenges(data);
        } catch (err) {
            setError('인기 챌린지를 불러오는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        setIsClient(true);
        fetchPopularChallenges();
    }, []);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
        // TODO: 추후 API 구현 시 정렬 로직 추가
    };

    const handleChallengeClick = (challengeId: number) => {
        setSelectedChallengeId(challengeId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedChallengeId(null);
        fetchPopularChallenges();
    };

    const handleCreateChallenge = async (formData: ChallengeFormData) => {
        if (!formData.regionId) {
          alert("지역 정보가 올바르지 않습니다.");
          return;
        }
        
        const calculatedEndDate =
          formData.duration === "직접입력"
            ? formData.endDate
            : calculateEndDateObject(formData.startDate, formData.duration);
    
        const endDate = formatDateToYYYYMMDD(calculatedEndDate);
    
        const requestData: ChallengeCreateRequest = {
          regionId: formData.regionId,
          categoryId: formData.categoryId,
          title: formData.title,
          description: formData.description,
          participants: Number(formData.participants),
          method: formData.verificationMethod,
          startDate: formatDateToYYYYMMDD(formData.startDate),
          endDate: endDate,
          image: formData.image,
          imageFile: formData.imageFile,
          status: true,
        };
    
        try {
          await createChallenge(requestData);
          setIsCreatingChallenge(false);
          router.push("/challenge");
          window.location.reload();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || '챌린지 등록에 실패했습니다. 다시 시도해주세요.';
          alert(errorMessage);
        }
      };

    if (!isClient) {
        return null;
    }

    if (isCreatingChallenge) {
        return isDesktop ? (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <main className="w-2/4 mx-auto relative h-screen flex flex-col">
                        <div className="pt-8 flex-1 overflow-y-auto no-scrollbar">
                            <CreateChallengeForm
                                onClose={() => setIsCreatingChallenge(false)}
                                onSubmit={handleCreateChallenge}
                                isDesktop={isDesktop}
                            />
                        </div>
                    </main>
                </div>
            </div>
        ) : (
            <CreateChallengeForm
                onClose={() => setIsCreatingChallenge(false)}
                onSubmit={handleCreateChallenge}
                isDesktop={isDesktop}
            />
        );
    }

    const popularChallengesContent = (
        <>
            <header className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-4 px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto flex items-center">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                    </button>
                    <h1 className="text-xl font-bold dark:text-white">챌린지 둘러보기</h1>
                </div>
            </header>
            
            <main className="max-w-4xl mx-auto p-4 pb-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        전체 ({challenges.length})
                    </h2>
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-200"
                        >
                            <option value="popular">인기순</option>
                            <option value="latest">최신순</option>
                            <option value="status">진행상태순</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <ChevronDownIcon className="h-4 w-4" />
                        </div>
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                <div className="grid grid-cols-1 gap-4">
                    {challenges.map((challenge) => (
                        <PopularChallengeItem 
                            key={challenge.challengeId} 
                            challenge={challenge}
                            onClick={() => handleChallengeClick(challenge.challengeId)}
                        />
                    ))}
                </div>
            </main>
        </>
    );

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            {isDesktop ? (
                <>
                    <div className="flex">
                        <Sidebar />
                        <div className="flex-1 ml-64">
                            {popularChallengesContent}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreatingChallenge(true)}
                        className="fixed z-30 bottom-5 right-5 bg-[#F4724F] text-white font-semibold p-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#e56b49] hover:scale-105 hover:shadow-xl"
                    >
                      <PlusIcon className="w-6 h-6" />
                    </button>
                </>
            ) : (
                <>
                    {popularChallengesContent}
                    <button
                        onClick={() => setIsCreatingChallenge(true)}
                        className="fixed z-30 bottom-5 right-4 bg-[#F4724F] text-white p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-[#e56b49] hover:scale-105 hover:shadow-xl"
                    >
                      <PlusIcon className="w-7 h-7" />
                    </button>
                </>
            )}
            
            {isModalOpen && selectedChallengeId && (
                <ChallengeApplyModal
                    challengeId={selectedChallengeId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default PopularChallengesClient; 