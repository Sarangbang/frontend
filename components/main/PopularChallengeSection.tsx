'use client';

import { useRouter } from 'next/navigation';
import ChallengeCard from './ChallengeCard';
import { useEffect, useState } from 'react';
import { getPopularChallenges } from '@/api/challenge';
import { PopularChallengeResponse } from '@/types/Challenge';
import ChallengeApplyModal from '../challenge/ChallengeApplyModal';

const PopularChallengeSection = () => {
    const router = useRouter();
    const [challenges, setChallenges] = useState<PopularChallengeResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

    const fetchPopularChallenges = async () => {
        try {
            const data = await getPopularChallenges();
            setChallenges(data);
        } catch (err) {
            setError('인기 챌린지를 불러오는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchPopularChallenges();
    }, []);

    const handleViewAll = () => {
        router.push('/challenges/popular');
    };

    const handleChallengeClick = (challengeId: number) => {
        setSelectedChallengeId(challengeId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedChallengeId(null);
        fetchPopularChallenges(); // 모달 닫을 때 데이터 새로고침
    };

    const challengesToShow = challenges.slice(0, 2);

    return (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">인기Challenge 🔥</h2>
                {challenges.length > 2 && (
                    <button 
                        className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                        onClick={handleViewAll}
                    >
                        전체보기
                    </button>
                )}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-wrap -m-2">
            {challengesToShow.map((challenge) => (
                <div 
                    key={challenge.challengeId}
                    className="w-1/2 p-2 cursor-pointer"
                    onClick={() => handleChallengeClick(challenge.challengeId)}
                >
                    <ChallengeCard 
                        image={challenge.image} 
                        location={challenge.region}
                        title={challenge.challengeTitle} 
                        progress={`${challenge.currentParticipants}/${challenge.maxParticipants}`} 
                    />
                </div>
            ))}
        </div>
        {isModalOpen && selectedChallengeId && (
            <ChallengeApplyModal
                challengeId={selectedChallengeId}
                onClose={handleCloseModal}
            />
        )}
    </div>
);
};

export default PopularChallengeSection; 