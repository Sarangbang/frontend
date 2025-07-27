"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { fetchChallengeDetail, fetchChallengeApplications, updateApplicationStatus } from "@/api/challenge";
import { ChallengeDetail } from "@/types/Challenge";
import { ChallengeApplication } from "@/types/Application";
import toast from "react-hot-toast";
import Modal from "@/components/common/Modal";
import Sidebar from "@/components/common/Sidebar";
import BottomNav from "@/components/common/BottomNav";

interface Props {
  challengeId: number;
}

const ChallengeManageClient = ({ challengeId }: Props) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [applications, setApplications] = useState<ChallengeApplication[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedApp, setSelectApp] = useState<ChallengeApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const statusLabelMap: Record<ChallengeApplication["challengeApplyStatus"], string> = {
    PENDING: "대기중",
    APPROVED: "승인",
    REJECTED: "거절",
  }

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 챌린지 정보와 신청서 목록을 동시에 로드
        const [challengeData, applicationsData] = await Promise.all([
          fetchChallengeDetail(challengeId),
          fetchChallengeApplications(challengeId)
        ]);
        
        setChallenge(challengeData);
        setApplications(applicationsData);
      } catch (error) {
        toast.error("데이터를 불러오는데 실패했습니다.");
      }
    };
    
    loadData();
  }, [challengeId]);

  // 신청서 승인/거절 처리 함수
  const handleApplicationAction = async (action: 'APPROVED' | 'REJECTED') => {
    if (!selectedApp || !comment.trim()) {
      toast.error("코멘트를 입력해주세요.");
      return;
    }

    setIsProcessing(true);
    try {
      await updateApplicationStatus(selectedApp.id, action, comment.trim());
      
      // 로컬 상태 업데이트
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApp.id 
            ? { ...app, challengeApplyStatus: action, comment: comment.trim() }
            : app
        )
      );

      toast.success(action === 'APPROVED' ? "신청이 승인되었습니다." : "신청이 거절되었습니다.");
      setIsModalOpen(false);
      setSelectApp(null);
      setComment("");
    } catch (error) {
      toast.error("처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient) return null;

  const mainContent = (
    <main className="flex flex-col items-center px-4 pt-2 pb-8">
      {/* 챌린지 정보 카드 */}
      <div className="w-full max-w-md flex flex-col items-center bg-white rounded-2xl shadow border border-gray-200 py-6 mb-6">
        <Image
          src={challenge?.imageUrl || "/images/charactors/gamza.png"}
          alt="챌린지 이미지"
          width={80}
          height={80}
          className="rounded-full object-cover mb-2 border border-gray-200"
        />
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-1">{challenge?.title || '챌..읽읍시다'}</h2>
          <p className="text-xs text-gray-400">{challenge?.startDate || '2025.07.22'} 생성</p>
        </div>
        <div className="w-full flex flex-col gap-2 mt-6 px-4">
          <button
            onClick={() => router.push(`/challenge-manage/${challengeId}/members`)}
            className="w-full h-12 bg-white text-pink-600 font-medium rounded-xl border border-pink-200 shadow-sm text-base flex items-center justify-center hover:bg-pink-50 transition"
            style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
          >
            챌린지 멤버 관리
          </button>
        </div>
      </div>

      {/* 참여 신청자 리스트 */}
      <div className="w-full max-w-md">
        <h3 className="font-semibold text-gray-900 mb-2">참여 신청 ({applications.length})</h3>
        <div className="bg-white rounded-2xl border border-gray-200 p-2">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              신청한 사용자가 없습니다.
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between px-2 py-3 border-b last:border-b-0 border-gray-100"
              >
                                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
                     <Image
                       src={
                         app.userProfileImageUrl && 
                         app.userProfileImageUrl.trim() !== '' && 
                         app.userProfileImageUrl !== 'null' 
                           ? app.userProfileImageUrl 
                           : "/images/charactors/gamza.png"
                       }
                       alt={app.userNickname}
                       width={40}
                       height={40}
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         // 이미지 로드 실패 시 기본 이미지로 대체
                         const target = e.target as HTMLImageElement;
                         target.src = "/images/charactors/gamza.png";
                       }}
                     />
                   </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{app.userNickname}</div>
                    <div className="text-xs text-gray-500">{app.userRegion}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString('ko-KR', { 
                        year: '2-digit', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })} 신청
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.challengeApplyStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    app.challengeApplyStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {statusLabelMap[app.challengeApplyStatus]}
                  </span>
                  <button
                    onClick={() => {
                      setSelectApp(app);
                      setComment(app.comment || "");
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    신청서 보기
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="flex items-center mb-4">
                <button onClick={() => router.back()} className="mr-4">
                  <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">챌린지 관리</h1>
              </div>
              {mainContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-16 pb-16">
          <header className="fixed top-0 left-0 right-0 z-10 flex items-center p-4 border-b border-gray-200 bg-white dark:bg-gray-900">
            <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">챌린지 관리</h1>
          </header>
          <main className="px-4 py-4">{mainContent}</main>
          <BottomNav />
        </div>
      )}

      {selectedApp && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectApp(null);
            setComment("");
          }}
          title="신청서 상세보기"
        >
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            {/* 프로필 */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-[72px] h-[72px] rounded-full border border-gray-200 shadow-sm overflow-hidden bg-gray-100">
                <Image
                  src={
                    selectedApp?.userProfileImageUrl && 
                    selectedApp.userProfileImageUrl.trim() !== '' && 
                    selectedApp.userProfileImageUrl !== 'null' 
                      ? selectedApp.userProfileImageUrl 
                      : "/images/charactors/gamza.png"
                  }
                  alt={selectedApp?.userNickname || "프로필"}
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/charactors/gamza.png";
                  }}
                />
              </div>
              <div className="text-center mt-1.5">
                <p className="font-bold text-lg text-gray-900">{selectedApp?.userNickname}</p>
                <p className="text-sm text-gray-500">{selectedApp?.userRegion}</p>
              </div>
            </div>

            {/* 신청일 / 상태 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-6">
              <span><strong>신청일:</strong> {selectedApp ? new Date(selectedApp.createdAt).toLocaleString() : ''}</span>
              <span><strong>상태:</strong> {selectedApp ? statusLabelMap[selectedApp.challengeApplyStatus] : ''}</span>
            </div>

            {/* 상세 내용 */}
            <div className="space-y-5 text-[15px] text-gray-800 mb-6">
              {selectedApp?.introduction && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">자기소개</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-800 whitespace-pre-line">{selectedApp.introduction}</div>
                </div>
              )}
              {selectedApp?.reason && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">신청사유</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-800 whitespace-pre-line">{selectedApp.reason}</div>
                </div>
              )}
              {selectedApp?.commitment && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">다짐</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-800 whitespace-pre-line">{selectedApp.commitment}</div>
                </div>
              )}
            </div>

            {/* 기존 코멘트 표시 (이미 처리된 경우) */}
            {selectedApp?.comment && (
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-1">방장 코멘트</p>
                <div className="bg-blue-50 rounded-lg p-3 text-gray-800">{selectedApp.comment}</div>
              </div>
            )}

            {/* 코멘트 입력 (PENDING 상태인 경우만) */}
            {selectedApp?.challengeApplyStatus === 'PENDING' && (
              <>
                <div className="mb-6">
                  <label className="block font-semibold text-gray-700 mb-2">
                    승인/거절 사유 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="승인 또는 거절하는 이유를 입력해주세요."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-200"
                    maxLength={100}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {comment.length}/100
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-center sm:justify-end gap-3">
                  <button
                    className="px-5 py-2 text-base font-semibold rounded-lg bg-[#F4724F] text-white hover:bg-[#e56b49] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleApplicationAction('APPROVED')}
                    disabled={isProcessing || !comment.trim()}
                  >
                    {isProcessing ? '처리중...' : '승인'}
                  </button>
                  <button
                    className="px-5 py-2 text-base font-semibold rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleApplicationAction('REJECTED')}
                    disabled={isProcessing || !comment.trim()}
                  >
                    {isProcessing ? '처리중...' : '거절'}
                  </button>
                </div>
              </>
            )}

            {/* 이미 처리된 신청서의 경우 */}
            {selectedApp?.challengeApplyStatus !== 'PENDING' && (
              <div className="text-center text-gray-500">
                이미 처리된 신청서입니다.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChallengeManageClient;
