import Image from 'next/image';
import Link from 'next/link';

interface VerifiableChallenge {
  id: number;
  location: string;
  title: string;
  currentParticipants: number;
  maxParticipants: number;
  image: string;
  isVerified: boolean;
}

interface VerifiableChallengeCardProps {
  challenge: VerifiableChallenge;
}

const VerifiableChallengeCard = ({ challenge }: VerifiableChallengeCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative w-20 h-20 mr-4 flex-shrink-0">
          <Image src={challenge.image} alt={challenge.title} width={80} height={80} className="rounded-lg object-cover" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{challenge.location}</p>
          <h3 className="text-md font-bold text-gray-800 dark:text-gray-200">{challenge.title} [{challenge.currentParticipants}/{challenge.maxParticipants}]</h3>
        </div>
      </div>
      {challenge.isVerified ? (
        <button
          disabled
          className="bg-gray-300 dark:bg-gray-600 text-white text-sm font-semibold px-8 py-3 rounded-lg cursor-not-allowed"
        >
          인증완료
        </button>
      ) : (
        <Link href={`/verification/${challenge.id}`}>
          <button className="bg-[#F4724F] text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-[#e56b49] transition-colors">
            인증하기
          </button>
        </Link>
      )}
    </div>
  );
};

export default VerifiableChallengeCard; 