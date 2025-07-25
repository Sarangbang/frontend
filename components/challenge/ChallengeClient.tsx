"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import ChallengeCard from "./ChallengeCard";
import {
  Challenge,
  ChallengeCreateRequest,
  ChallengeFormData,
  ChallengeSummaryResponse
} from "@/types/Challenge";
import Sidebar from "../common/Sidebar";
import CreateChallengeForm from "./CreateChallengeForm";
import ContentHeader from "../common/ContentHeader";
import Tabs, { type Tab } from "../common/Tabs";
import { createChallenge, getChallengeSummary } from "@/api/challenge";
import {
  formatDateToYYYYMMDD,
  calculateEndDateObject,
  calculatePeriod2,
  getChallengeStatus,
} from "@/util/dateUtils";

const CHALLENGE_TABS: Tab<"멤버" | "방장">[] = [
  { id: "멤버", label: "멤버" },
  { id: "방장", label: "방장" },
];


const ChallengeClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"멤버" | "방장">("멤버");
  const [challenges, setChallenges] = useState<ChallengeSummaryResponse[]>([]);
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchChallenges = async () => {
      try {
        const data = await getChallengeSummary();
        setChallenges(data);
      } catch (error) {
        alert("챌린지 목록을 불러오는데 실패했습니다.");
      }
    };
    fetchChallenges();
  }, []);

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
    } catch (error) {
      alert("챌린지 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!isClient) {
    return null;
  }

  const filteredChallenges = challenges.filter((challenge) => {
    if (activeTab === "방장") return challenge.role === "owner";
    if (activeTab === "멤버") return challenge.role === "member";
    return false;
  });

  const mappedChallenges: Challenge[] = filteredChallenges.map((c) => ({
    id: c.id,
    title: c.title,
    location: c.location,
    currentParticipants: c.currentParticipants,
    participants: c.participants,
    category: c.category,
    description: c.description,
    period: calculatePeriod2(c.startDate, c.endDate),
    participantsString: `${c.currentParticipants}/${c.participants}명`,
    startDate: c.startDate,
    endDate: c.endDate,
    image: c.image || "/images/charactors/gamza.png", // 기본 이미지
    status: c.status,
  }));

  const challengeContent = (
    <>
      <Tabs
        tabs={CHALLENGE_TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

        <div className="p-4">
          {/* <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="챌린지명을 입력해주세요"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-white"
            />
          </div> */}

        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600 dark:text-gray-400">
            전체 챌린지 ({mappedChallenges.length})
          </p>
        </div>

        <div>
          {mappedChallenges.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              참여한 챌린지가 없습니다.
            </div>
          ) : (
            mappedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="cursor-pointer"
                onClick={() => router.push(`/challenge/${challenge.id}`)}
              >
                <ChallengeCard
                  challenge={challenge}
                  isLeaderView={activeTab === "방장"}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="w-2/4 mx-auto relative h-screen flex flex-col">
              {isCreatingChallenge ? (
                <div className="pt-8 flex-1 overflow-y-auto no-scrollbar">
                  <CreateChallengeForm
                    onClose={() => setIsCreatingChallenge(false)}
                    onSubmit={handleCreateChallenge}
                    isDesktop={isDesktop}
                  />
                </div>
              ) : (
                <>
                  <ContentHeader
                    title="Challenge"
                    isDesktop={isDesktop}
                    isClient={isClient}
                  />
                  <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-white dark:bg-gray-800 rounded-lg shadow">
                    {challengeContent}
                  </div>
                  {activeTab === "방장" && (
                    <button
                      onClick={() => setIsCreatingChallenge(true)}
                      className="absolute z-30 bottom-5 right-5 bg-[#F4724F] text-white font-semibold p-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#e56b49] hover:scale-105 hover:shadow-xl"
                    >
                      <PlusIcon className="w-6 h-6" />
                      {/* <span>챌린지 생성</span> */}
                    </button>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      ) : isCreatingChallenge ? (
        <CreateChallengeForm
          onClose={() => setIsCreatingChallenge(false)}
          onSubmit={handleCreateChallenge}
          isDesktop={isDesktop}
        />
      ) : (
        <>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 pb-24">
            <ContentHeader
              title="Challenge"
              isDesktop={isDesktop}
              isClient={isClient}
            />
            {challengeContent}
          </div>
          {activeTab === "방장" && (
            <button
              onClick={() => setIsCreatingChallenge(true)}
              className="fixed z-30 bottom-5 right-4 bg-[#F4724F] text-white p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-[#e56b49] hover:scale-105 hover:shadow-xl"
            >
              <PlusIcon className="w-7 h-7" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ChallengeClient;
