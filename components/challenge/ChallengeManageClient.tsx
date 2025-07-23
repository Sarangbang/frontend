"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { fetchChallengeDetail } from "@/api/challenge";
import { ChallengeDetail } from "@/types/Challenge";
import { ChallengeApplication } from "@/types/Application";
import toast from "react-hot-toast";
import Modal from "@/components/common/Modal";
import Sidebar from "@/components/common/Sidebar";
import BottomNav from "@/components/common/BottomNav";

const mockApplications: ChallengeApplication[] = [
  {
    applicationId: 1,
    userId: "101",
    nickname: "김개발",
    location: "서울특별시 강남구",
    appliedAt: "2025-07-23T10:00:00Z",
    status: "PENDING",
  },
  {
    applicationId: 2,
    userId: "102",
    nickname: "박디자이너",
    location: "부산광역시 해운대구",
    appliedAt: "2025-07-22T16:30:00Z",
    status: "APPROVED",
  },
];

interface Props {
  challengeId: number;
}

const ChallengeManageClient = ({ challengeId }: Props) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedApp, setSelectApp] = useState<ChallengeApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const loadChallenge = async () => {
      try {
        const data = await fetchChallengeDetail(challengeId);
        setChallenge(data);
      } catch (error) {
        toast.error("챌린지 정보를 불러오는데 실패했습니다.");
      }
    };
    loadChallenge();
  }, [challengeId]);

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
          <h2 className="text-lg font-bold text-gray-900 mb-1">{challenge?.title || '챌..읽읍시다'}</h2>
          <p className="text-xs text-gray-400">{challenge?.startDate || '2025.07.22'} 생성</p>
        </div>
        <div className="w-full flex flex-col gap-2 mt-6 px-4">
          <button
            onClick={() => router.push(`/challenge/${challengeId}/edit`)}
            className="w-full h-12 bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200 text-base flex items-center justify-center mb-1 hover:bg-gray-100 transition"
          >
            챌린지 정보 수정
          </button>
          <button
            onClick={() => router.push(`/challenge-manage/${challengeId}/members`)}
            className="w-full h-12 bg-white text-pink-600 font-bold rounded-xl border border-pink-200 shadow-sm text-base flex items-center justify-center hover:bg-pink-50 transition"
            style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
          >
            챌린지 멤버 관리
          </button>
        </div>
      </div>

      {/* 참여 신청자 리스트 */}
      <div className="w-full max-w-md">
        <h3 className="font-semibold text-gray-900 mb-2">참여 신청 ({mockApplications.length})</h3>
        <div className="bg-white rounded-2xl border border-gray-200 p-2">
          {mockApplications.map((app) => (
            <div
              key={app.userId}
              className="flex items-center justify-between px-2 py-3 border-b last:border-b-0 border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={"/images/charactors/gamza.png"}
                  alt={app.nickname}
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-200"
                />
                <div>
                  <div className="font-bold text-gray-900 text-sm">{app.nickname}</div>
                  <div className="text-xs text-gray-500">{app.location}</div>
                  <div className="text-xs text-gray-400">{new Date(app.appliedAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })} 신청</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectApp(app);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
              >
                신청서 보기
              </button>
            </div>
          ))}
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
          }}
          title="신청서 상세보기"
        >
          <div className="space-y-2">
            <p><strong>닉네임:</strong> {selectedApp.nickname}</p>
            <p><strong>지역:</strong> {selectedApp.location}</p>
            <p><strong>신청일:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
            <p><strong>상태:</strong> {selectedApp.status}</p>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-600"
              onClick={() => {
                toast.success("신청이 승인되었습니다.");
                selectedApp.status = "APPROVED";
                setIsModalOpen(false);
                setSelectApp(null);
              }}
            >
              승인
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                toast.error("신청이 거절되었습니다.");
                selectedApp.status = "REJECTED";
                setIsModalOpen(false);
                setSelectApp(null);
              }}
            >
              거절
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChallengeManageClient;
