"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';
import ChallengeCard from "./ChallengeCard";
import { Challenge, ChallengeCreateRequest, ChallengeFormData } from "@/types/Challenge";
import { CategoryDto } from "@/types/Category";
import { fetchAllChallenges, fetchChallengesByCategory, createChallenge, getPopularChallenges } from "@/lib/api/challenge";
import { fetchCategories } from "@/lib/api/category";
import Sidebar from "../common/Sidebar";
import BottomNav from "../common/BottomNav";
import ChallengeApplyModal from "./ChallengeApplyModal";
import CreateChallengeForm from "./CreateChallengeForm";
import { formatDateToYYYYMMDD, calculateEndDateObject } from "@/util/dateUtils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const ChallengeBrowseClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [filter, setFilter] = useState('latest');

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    
    const handleResize = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  // 카테고리 데이터 불러오기
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        toast.error("카테고리 데이터를 불러오는데 실패했습니다.");
      }
    };
    loadCategories();
  }, []);
  
  // URL의 카테고리 ID 감지
  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    setSelectedCategoryId(categoryId ? parseInt(categoryId) : 0);
  }, [searchParams]);

  const loadInitialChallenges = useCallback(async (categoryId: number) => {
    if (categoryId === -1) {
      setIsLoading(true);
      setChallenges([]);
      setCurrentPage(0);
      try {
        const popularData = await getPopularChallenges();
        const mappedChallenges: Challenge[] = popularData.map((p) => ({
          id: p.challengeId,
          title: p.challengeTitle,
          description: "",
          participants: p.maxParticipants,
          currentParticipants: p.currentParticipants,
          status: true,
          startDate: p.startDate,
          endDate: p.endDate,
          image: p.image,
          category: p.categoryName,
          categoryName: p.categoryName,
          location: p.region,
        }));
        setChallenges(mappedChallenges);
        setTotalCount(mappedChallenges.length);
        setHasMore(false);
      } catch (error) {
        toast.error("인기 챌린지를 불러오는데 실패했습니다.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setChallenges([]);
    setCurrentPage(0);
    setHasMore(true);

    const apiStatus = filter === 'upcoming' ? 'SCHEDULED' : filter === 'in_progress' ? 'IN_PROGRESS' : undefined;
    
    try {
      const response = await (categoryId === 0
        ? fetchAllChallenges(0, 10, apiStatus)
        : fetchChallengesByCategory(categoryId, 0, 10, apiStatus));
      
      setChallenges(response.content);
      setTotalCount(response.totalElements);
      setHasMore(!hasMore);
    } catch (error) {
      toast.error("챌린지 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // 카테고리 변경 시 초기 챌린지 데이터 로드
  useEffect(() => {
    if (selectedCategoryId === null) return;
    loadInitialChallenges(selectedCategoryId);
  }, [selectedCategoryId, loadInitialChallenges]);

  const loadMoreChallenges = useCallback(async () => {
    if (isLoadingMore || !hasMore || selectedCategoryId === null || selectedCategoryId === -1) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    const apiStatus = filter === 'upcoming' ? 'SCHEDULED' : filter === 'in_progress' ? 'IN_PROGRESS' : undefined;

    try {
      const response = await (selectedCategoryId === 0
        ? fetchAllChallenges(nextPage, 10, apiStatus)
        : fetchChallengesByCategory(selectedCategoryId, nextPage, 10, apiStatus));
        
      setChallenges(prev => [...prev, ...response.content]);
      
      setCurrentPage(nextPage);
      setHasMore(!response.last);
    } catch (error) {
      toast.error("추가 챌린지를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, selectedCategoryId, filter]);

  const lastChallengeElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreChallenges();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, loadMoreChallenges]);

  const handleCategorySelect = (categoryId: number) => {
    if (categoryId === selectedCategoryId) {
      loadInitialChallenges(categoryId);
    } else {
      const path = categoryId === 0 ? '/challenges/all' : `/challenges/all?categoryId=${categoryId}`;
      router.push(path);
    }
  };

  const handleGoBack = () => router.back();
  const handleChallengeClick = (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallengeId(null);
    if(selectedCategoryId !== null) {
      loadInitialChallenges(selectedCategoryId);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleCreateChallenge = async (formData: ChallengeFormData) => {
    if (!formData.regionId) {
      toast.error("지역 정보가 올바르지 않습니다.");
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '챌린지 등록에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
    }
  };

  const getSelectedCategoryName = () => {
    if (selectedCategoryId === -1) return "인기순";
    if (selectedCategoryId === null || selectedCategoryId === 0) return "전체";
    const category = categories.find(cat => cat.categoryId === selectedCategoryId);
    return category ? category.categoryName : "전체";
  };

  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (isCreatingChallenge) {
    return isDesktop ? (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                <main className="w-2/4 mx-auto relative h-screen flex flex-col">
                    <div className="pt-8 flex-1 overflow-y-auto no-scrollbar">
                        <CreateChallengeForm
                            onClose={() => setIsCreatingChallenge(false)}
                            onSubmit={handleCreateChallenge}
                            isDesktop={isDesktop}
                        />
                    </div>
                </main>
            </div>
        </div>
    ) : (
        <CreateChallengeForm
            onClose={() => setIsCreatingChallenge(false)}
            onSubmit={handleCreateChallenge}
            isDesktop={isDesktop}
        />
    );
  }

  const challengeContent = (
    <>
      {/* 카테고리 선택 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="pb-4 flex overflow-x-auto space-x-4 pb-2">
          <button
            onClick={() => handleCategorySelect(-1)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${selectedCategoryId === -1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            인기순
          </button>
          <button
            onClick={() => handleCategorySelect(0)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${selectedCategoryId === 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => handleCategorySelect(category.categoryId)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${selectedCategoryId === category.categoryId ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* 챌린지 목록 */}
      <div>
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {getSelectedCategoryName()} ({totalCount})
          </h2>
          <div className="relative">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-200"
            >
              <option value="latest">최신순</option>
              <option value="upcoming">예정</option>
              <option value="in_progress">진행중</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {selectedCategoryId === 0 ? '아직 챌린지가 없습니다.' : '해당 카테고리에 챌린지가 없습니다.'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {challenges.map((challenge, index) => (
                <div
                  key={`${challenge.id}-${index}`}
                  ref={index === challenges.length - 1 ? lastChallengeElementRef : null}
                  className="cursor-pointer"
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  <ChallengeCard challenge={challenge} isLeaderView={false} />
                </div>
              ))}
            </div>
            
            {isLoadingMore && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
            
            {!hasMore && challenges.length > 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                모든 챌린지를 불러왔습니다.
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isDesktop ? (
        <>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
              <header className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-4 px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto flex items-center">
                    <button onClick={handleGoBack} className="mr-4">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                    </button>
                    <h1 className="text-xl font-bold dark:text-white">챌린지 둘러보기</h1>
                </div>
              </header>
              <main className="max-w-4xl mx-auto px-4 py-8">
                {challengeContent}
              </main>
            </div>
          </div>
          <button
            onClick={() => setIsCreatingChallenge(true)}
            className="fixed z-30 bottom-5 right-5 bg-[#F4724F] text-white font-semibold p-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#e56b49] hover:scale-105 hover:shadow-xl"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </>
      ) : (
        <>
          {/* 모바일/태블릿 헤더 */}
          <header className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-4 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto flex items-center">
                <button onClick={handleGoBack} className="mr-4">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                </button>
                <h1 className="text-xl font-bold dark:text-white">챌린지 둘러보기</h1>
            </div>
          </header>
          <main>
            {challengeContent}
          </main>
          <BottomNav />
          <button
              onClick={() => setIsCreatingChallenge(true)}
              className="fixed z-30 bottom-20 right-4 bg-[#F4724F] text-white p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-[#e56b49] hover:scale-105 hover:shadow-xl"
            >
              <PlusIcon className="w-7 h-7" />
          </button>
        </>
      )}
      {isModalOpen && selectedChallengeId && (
        <ChallengeApplyModal
          challengeId={selectedChallengeId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ChallengeBrowseClient;