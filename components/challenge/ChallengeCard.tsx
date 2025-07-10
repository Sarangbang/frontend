import Image from 'next/image';
import { Challenge } from '@/types/Challenge';
import { ClockIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ChallengeCardProps {
  challenge: Challenge;
  isLeaderView: boolean;
}

const ChallengeCard = ({ challenge, isLeaderView }: ChallengeCardProps) => {
  const { status, location, title, currentParticipants, maxParticipants, category, period, participants, startDate, image } = challenge;

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex">
        <div className="relative w-24 h-24 mr-4 flex-shrink-0">
          <Image src={image} alt={title} width={96} height={96} className="rounded-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipStyle(status)}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{location}</p>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white my-1">{title} [{currentParticipants}/{maxParticipants}]</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category}</p>
          <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1.5" />
              <span>기간: {period}</span>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1.5" />
              <span>참여자: {participants}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              <span>시작일: {startDate}</span>
            </div>
          </div>
        </div>
      </div>
      {isLeaderView && (status === '예정' || status === '진행중') && (
        <div className="flex justify-end mt-3">
          <button className="bg-white text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
            챌린지 종료
          </button>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard; 