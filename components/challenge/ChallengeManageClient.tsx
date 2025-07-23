"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { fetchChallengeDetail } from "@/api/challenge";
import { ChallengeDetail } from "@/types/Challenge";
import toast from "react-hot-toast";

interface Props {
  challengeId: number;
}

const ChallengeManageClient = ({ challengeId }: Props) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">챌린지 관리</h1>
        <div className="w-6 h-6" />
      </header>

      {challenge ? (
        <main className="p-4 space-y-6">
          <div className="flex flex-col items-center">
            <Image
              src={challenge.imageUrl || "/images/charactors/gamza.png"}
              alt="챌린지 이미지"
              width={80}
              height={80}
              className="rounded-full object-cover mx-auto mb-2"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {challenge.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {challenge.startDate} 생성
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => router.push(`/challenge/${challengeId}/edit`)}
              className="w-full py-3 px-4 border rounded-md font-medium text-gray-800 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              챌린지 정보 수정
            </button>
            <button
              onClick={() => router.push(`/challenge/${challengeId}/members`)}
              className="w-full py-3 px-4 border rounded-md font-medium text-gray-800 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              챌린지 멤버 관리
            </button>
          </div>

          {/* 참여 신청 리스트
          {challenge.applications && challenge.applications.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                참여 신청 ({challenge.applications.length})
              </h3>
              <div className="space-y-4">
                {challenge.applications.map((app) => (
                  <div
                    key={app.userId}
                    className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {app.nickname}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {app.address} | {app.appliedAt}
                      </p>
                    </div>
                    <button className="text-sm font-medium px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      신청서 보기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </main>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          챌린지 정보를 불러오는 중입니다...
        </div>
      )}
    </div>
  );
};

export default ChallengeManageClient;
