import apiClient from "./apiClient";
import { ChallengeCreateRequest, Challenge, PageResponse, ChallengeSummaryResponse, ChallengeDetail, ChallengeJoinRequest, PopularChallengeResponse } from "@/types/Challenge";

/**
 * 모든 챌린지를 조회합니다 (무한스크롤용)
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 * @returns 페이지 정보를 포함한 챌린지 목록
 */
export const fetchAllChallenges = async (page: number = 0, size: number = 10): Promise<PageResponse<Challenge>> => {
    const response = await apiClient.get(`/challenges/all?page=${page}&size=${size}&sort=id,desc`);
    return response.data; // 전체 페이지 응답 반환
};

/**
 * 특정 카테고리의 챌린지를 조회합니다 (무한스크롤용)
 * @param categoryId 카테고리 ID
 * @param page 페이지 번호 (기본값: 0)
 * @param size 페이지 크기 (기본값: 10)
 * @returns 페이지 정보를 포함한 해당 카테고리의 챌린지 목록
 */
export const fetchChallengesByCategory = async (categoryId: number, page: number = 0, size: number = 10): Promise<PageResponse<Challenge>> => {
    const response = await apiClient.get(`/challenges/categories/${categoryId}?page=${page}&size=${size}&sort=id,desc`);
    return response.data; // 전체 페이지 응답 반환
};

/**
 * 신규 챌린지를 등록합니다
 * @param data Challenge 생성 요청 데이터
 * @returns 생성된 챌린지 정보
 */
export const createChallenge = async (data: ChallengeCreateRequest) => {
  const formData = new FormData();
  const { imageFile, ...challengeData } = data;

  formData.append(
    "challengeDTO",
    new Blob([JSON.stringify(challengeData)], {
      type: "application/json",
    })
  );

  if (imageFile instanceof File) {
    formData.append("imageFile", imageFile);
  }

  const response = await apiClient.post("/challenges", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getChallengeSummary = async (): Promise<ChallengeSummaryResponse[]> => {
  const response = await apiClient.get<ChallengeSummaryResponse[]>("/challenge-members");
  return response.data;
};

export const fetchChallengeDetail = async (challengeId: number): Promise<ChallengeDetail> => {
  try {
    const response = await apiClient.get<ChallengeDetail>(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinChallenge = async (challengeId: number, joinData: ChallengeJoinRequest): Promise<void> => {
  try {
    await apiClient.post(`/challenge/application`, joinData);
  } catch (error) {
    throw error;
  }
};

// 인기 챌린지 조회
export const getPopularChallenges = async (): Promise<PopularChallengeResponse[]> => {
  const response = await apiClient.get<PopularChallengeResponse[]>("/challenges/popularity");
  return response.data;
};

