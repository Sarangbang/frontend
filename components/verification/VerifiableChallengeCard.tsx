import Image from 'next/image';
import Link from 'next/link';
import { getChallengeStatus } from '@/util/dateUtils';

interface VerifiableChallenge {
  id: number;
  location: string;
  title: string;
  currentParticipants: number;
  maxParticipants: number;
  image: string;
  verifyStatus: boolean;
  startDate: string;
  endDate: string;
}

interface VerifiableChallengeCardProps {
  challenge: VerifiableChallenge;
}

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

const VerifiableChallengeCard = ({ challenge }: VerifiableChallengeCardProps) => {
  const status = getChallengeStatus(challenge.startDate, challenge.endDate);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 flex items-center justify-between">
      <div className="flex flex-col flex-1">
        <div className="flex items-center">
          <div className="relative w-20 h-20 mr-4 flex-shrink-0 overflow-hidden">
            <Image src={challenge.image} alt={challenge.title} width={80} height={80} className="rounded-lg object-cover w-full h-full" />
          </div>
          <div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full mb-1 inline-block ${getStatusChipStyle(status)}`}>
              {status}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">{challenge.location}</p>
            
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-200">{challenge.title} [{challenge.currentParticipants}/{challenge.maxParticipants}]</h3>
          </div>
        </div>
      </div>
      {challenge.verifyStatus ? (
        <button
          disabled
          className="bg-gray-300 dark:bg-gray-600 text-white text-sm font-semibold px-8 py-3 rounded-lg cursor-not-allowed w-32 min-w-[80px] max-w-xs text-center"
        >
          인증완료
        </button>
      ) : (
        <Link href={{ pathname: `/verification/${challenge.id}`, query: { title: challenge.title } }}>
          <button className="bg-[#F4724F] text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-[#e56b49] transition-colors w-32 min-w-[80px] max-w-xs text-center">
            인증하기
          </button>
        </Link>
      )}
    </div>
  );
};

export default VerifiableChallengeCard; 