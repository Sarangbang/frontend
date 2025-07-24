import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Challenge } from '@/types/Challenge';
import { ClockIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { calculatePeriod, formatPeriod } from '@/util/dateUtils';
import { getPresignedUrl } from '@/api/files';
import { useRouter } from 'next/navigation';

interface ChallengeCardProps {
  challenge: Challenge;
  isLeaderView: boolean;
}

const ChallengeCard = ({ challenge, isLeaderView }: ChallengeCardProps) => {
  const { status, location, title, currentParticipants, participants, category, description, startDate, endDate, image } = challenge;
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(''); // Presigned URL용 상태 추가
  const router = useRouter();

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        if (!image || image.startsWith('http') || image.startsWith('/')) {
          // 절대경로거나 내부 리소스면 그대로 사용
          setImageUrl(image || '/images/charactors/gamza.png');
          return;
        }

        // 상대 경로거나 S3 경로일 경우 Presigned URL 요청
        const presigned = await getPresignedUrl(image);
        setImageUrl(presigned);
      } catch (err) {
        console.error('Presigned URL 요청 실패: ', err);
        setImageUrl('/images/charactors/gamza.png');
      }
    };

    fetchImageUrl();
  }, [image]);

  // 기간 계산
  const periodDays = calculatePeriod(startDate, endDate);
  const formattedPeriod = formatPeriod(periodDays);

  const getDynamicStatus = (startDateStr: string, endDateStr: string): '예정' | '진행중' | '종료' => {
    const today = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (today < start) {
      return '예정';
    } else if (today >= start && today <= end) {
      return '진행중';
    } else {
      return '종료';
    }
  };

  const dynamicStatus = getDynamicStatus(startDate, endDate);

  // 이미지 경로 처리 함수
  // const getImageSrc = (imagePath: string): string => {
  //   // 이미지 에러가 발생했거나 이미지가 없으면 기본 이미지 사용
  //   if (imageError || !imagePath || imagePath.trim() === '') {
  //     return '/images/charactors/gamza.png';
  //   }
    
  //   // 이미지가 절대 URL인지 확인 (http:// 또는 https://로 시작)
  //   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
  //     return imagePath;
  //   }
    
  //   // 이미지가 이미 /로 시작하는지 확인
  //   if (imagePath.startsWith('/')) {
  //     return imagePath;
  //   }
    
  //   // 파일명만 있는 경우 /images/ 접두사 추가
  //   return `/images/challenges/${imagePath}`;
  // };

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImageError(true);
  };

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
          <Image 
            src={imageUrl} 
            alt={title} 
            width={96} 
            height={96} 
            className="rounded-full object-cover aspect-square"
            onError={handleImageError}
            unoptimized
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipStyle(dynamicStatus)}`}>
              {dynamicStatus}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{location} · {challenge.categoryName || category}</p>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white my-1">{title} [{currentParticipants}/{participants}]</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1.5" />
              <span>기간: {formattedPeriod}</span>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1.5" />
              <span>참여자: {currentParticipants}/{participants}명</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              <span>시작일: {startDate}</span>
            </div>
          </div>
        </div>
      </div>
      {isLeaderView && (dynamicStatus === '예정' || dynamicStatus === '진행중') && (
        <div className="flex justify-end mt-3">
          <button 
            onClick={(e) =>
              {
                e.stopPropagation(); // 이벤트 전파 차단
                console.log("이동 대상 challenge.id:", challenge.id);  // 반드시 숫자여야 함
                router.push(`/challenge-manage/${String(challenge.id)}`)
              }
            }
            className="bg-white text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            챌린지 관리
          </button>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard; 