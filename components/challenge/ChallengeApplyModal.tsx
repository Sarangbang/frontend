'use client';

import { useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { fetchChallengeDetail, joinChallenge } from '@/api/challenge';
import { ChallengeDetail, ChallengeJoinRequest } from '@/types/Challenge';
import ExpandableText from '../common/ExpandableText';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const BaseModal = ({ children, onClose }: ModalProps) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] flex">
        {children}
      </div>
    </div>
);

interface ChallengeApplyModalProps {
  challengeId: number;
  onClose: () => void;
}

const ChallengeApplyModal = ({ challengeId, onClose }: ChallengeApplyModalProps) => {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState<ChallengeJoinRequest>({
    introduction: '',
    reason: '',
    commitment: '',
    challengeId: challengeId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getChallengeDetail = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChallengeDetail(challengeId);
        setChallenge(data);
        setApplicationData(prev => ({ ...prev, challengeId: data.challengeId }));
      } catch (error) {
        toast.error('챌린지 정보를 불러오는데 실패했습니다.');
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    getChallengeDetail();
  }, [challengeId, onClose]);

  const handleInputChange = (field: keyof ChallengeJoinRequest, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitApplication = async () => {
    if (!challenge) return;

    // 입력 검증
    if (!applicationData.introduction.trim()) {
      toast.error('자기소개를 입력해주세요.');
      return;
    }
    if (!applicationData.reason.trim()) {
      toast.error('신청사유를 입력해주세요.');
      return;
    }
    if (!applicationData.commitment.trim()) {
      toast.error('다짐을 입력해주세요.');
      return;
    }

    if (applicationData.introduction.length > 500) {
      toast.error('자기소개는 500자 미만으로 작성해주세요.');
      return;
    }
    if (applicationData.reason.length > 500) {
      toast.error('신청사유는 500자 미만으로 작성해주세요.');
      return;
    }
    if (applicationData.commitment.length > 500) {
      toast.error('다짐은 500자 미만으로 작성해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await joinChallenge(challenge.challengeId, applicationData);
      toast.success('챌린지 신청이 완료되었습니다!');
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('챌린지 신청에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApplicable = challenge && challenge.challengeStatus === 'ACTIVE' && challenge.currentParticipants < challenge.maxParticipants;
  const isFull = challenge && challenge.currentParticipants >= challenge.maxParticipants;
  const isEnded = challenge && challenge.challengeStatus !== 'ACTIVE';

  const renderStatus = () => {
    if (isFull) {
      return <span className="text-sm text-red-500 font-bold">인원이 모두 모집되었습니다.</span>;
    }
    if (isEnded) {
      return <span className="text-sm text-red-500 font-bold">종료된 챌린지입니다.</span>;
    }
    return null;
  };

  // 신청서 작성 폼 렌더링
  if (showApplicationForm && challenge) {
    return (
      <BaseModal onClose={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-full overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">챌린지 신청서</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  자기소개 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicationData.introduction}
                  onChange={(e) => handleInputChange('introduction', e.target.value)}
                  placeholder="간단한 자기소개를 작성해주세요."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#F47150] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {applicationData.introduction.length}/500자
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  신청사유 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicationData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="이 챌린지에 참여하고 싶은 이유를 작성해주세요."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#F47150] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {applicationData.reason.length}/500자
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  다짐 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={applicationData.commitment}
                  onChange={(e) => handleInputChange('commitment', e.target.value)}
                  placeholder="챌린지를 완주하기 위한 다짐을 작성해주세요."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#F47150] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {applicationData.commitment.length}/500자
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting || !applicationData.introduction.trim() || !applicationData.reason.trim() || !applicationData.commitment.trim()}
              className="w-full px-4 py-3 rounded-md bg-[#F47150] text-white font-bold hover:bg-[#e56b49] disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '신청 중...' : '신청하기'}
            </button>
          </div>
        </div>
      </BaseModal>
    );
  }

  // 챌린지 상세 정보 렌더링
  return (
    <BaseModal onClose={onClose}>
        {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-10 w-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        ) : challenge ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-full overflow-hidden">
                <div className="relative">
                    <div className="w-full h-48 relative">
                        <Image
                            src={challenge.imageUrl}
                            alt={challenge.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-black/40 rounded-full p-1 text-white hover:bg-black/60 transition-colors"
                        aria-label="닫기"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <span className="text-sm font-semibold" style={{ color: '#F47150' }}>{challenge.category.categoryName}</span>
                    <h2 className="text-2xl font-medium mt-1 text-gray-900 dark:text-white">{challenge.title}</h2>
                    
                    <div className="mt-3">
                        <ExpandableText text={challenge.description} maxLength={50} />
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                <div>
                                    <dt className="font-semibold text-gray-800 dark:text-gray-200">참여 인원</dt>
                                    <dd className="text-gray-600 dark:text-gray-400">{challenge.currentParticipants} / {challenge.maxParticipants} 명</dd>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                <div>
                                    <dt className="font-semibold text-gray-800 dark:text-gray-200">인증 방법</dt>
                                    <dd className="text-gray-600 dark:text-gray-400">
                                      <ExpandableText text={challenge.method} maxLength={50} />
                                    </dd>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                                <div>
                                    <dt className="font-semibold text-gray-800 dark:text-gray-200">챌린지 기간</dt>
                                    <dd className="text-gray-600 dark:text-gray-400">{challenge.startDate} ~ {challenge.endDate}</dd>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <div>
                                    <dt className="font-semibold text-gray-800 dark:text-gray-200">지역</dt>
                                    <dd className="text-gray-600 dark:text-gray-400">{challenge.location}</dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="p-4 mt-auto bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                    <div className="text-center h-5 mb-2">
                        {renderStatus()}
                    </div>
                    <button
                        onClick={() => setShowApplicationForm(true)}
                        disabled={!isApplicable}
                        className="w-full px-4 py-3 rounded-md bg-[#F47150] text-white font-bold hover:bg-[#e56b49] disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        신청서 작성하기
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-10 w-full text-center text-gray-500 dark:text-gray-400">
                챌린지 정보를 불러올 수 없습니다.
            </div>
        )}
    </BaseModal>
  );
};

export default ChallengeApplyModal; 