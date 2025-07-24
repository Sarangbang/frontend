"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import toast from 'react-hot-toast';
import ChallengeCard from "./ChallengeCard";
import { Challenge } from "@/types/Challenge";
import { CategoryDto } from "@/types/Category";
import { fetchAllChallenges, fetchChallengesByCategory } from "@/api/challenge";
import { fetchCategories } from "@/api/category";
import Sidebar from "../common/Sidebar";
import BottomNav from "../common/BottomNav";
import ChallengeApplyModal from "./ChallengeApplyModal";

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
    setIsLoading(true);
    setChallenges([]);
    setCurrentPage(0);
    setHasMore(true);
    
    try {
      const response = await (categoryId === 0
        ? fetchAllChallenges(0, 10)
        : fetchChallengesByCategory(categoryId, 0, 10));
      
      setChallenges(response.content);
      setTotalCount(response.totalElements);
      setHasMore(!response.last);
    } catch (error) {
      toast.error("챌린지 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 카테고리 변경 시 초기 챌린지 데이터 로드
  useEffect(() => {
    if (selectedCategoryId === null) return;
    loadInitialChallenges(selectedCategoryId);
  }, [selectedCategoryId, loadInitialChallenges]);

  const loadMoreChallenges = useCallback(async () => {
    if (isLoadingMore || !hasMore || selectedCategoryId === null) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const response = await (selectedCategoryId === 0
        ? fetchAllChallenges(nextPage, 10)
        : fetchChallengesByCategory(selectedCategoryId, nextPage, 10));
        
      setChallenges(prev => [...prev, ...response.content]);
      
      setCurrentPage(nextPage);
      setHasMore(!response.last);
    } catch (error) {
      toast.error("추가 챌린지를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, selectedCategoryId]);

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

  const getSelectedCategoryName = () => {
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

  const challengeContent = (
    <>
      {/* 데스크톱 헤더 */}
      <header className="hidden lg:flex items-center p-4 border-b-2 mb-4">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">챌린지 둘러보기</h1>
      </header>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto space-x-4 pb-2">
          <button
            onClick={() => handleCategorySelect(0)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedCategoryId === 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => handleCategorySelect(category.categoryId)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedCategoryId === category.categoryId ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* 챌린지 목록 */}
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {getSelectedCategoryName()} ({totalCount})
          </h2>
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
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="max-w-4xl mx-auto px-4 py-8">
              {challengeContent}
            </main>
          </div>
        </div>
      ) : (
        <div className="pt-16 pb-16">
          {/* 모바일/태블릿 헤더 */}
          <div className="fixed top-0 left-0 right-0 z-10 flex items-center p-4 border-b border-gray-200 bg-white dark:bg-gray-900 lg:hidden">
            <button onClick={handleGoBack} className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">챌린지 둘러보기</h1>
          </div>
          <main>
            {challengeContent}
          </main>
          <BottomNav />
        </div>
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