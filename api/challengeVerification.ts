import apiClient from "./apiClient";
import { ChallengeVerificationByDate } from "@/types/Challenge";

/**
 * 특정 챌린지의 날짜별 인증 정보를 조회합니다.
 * @param challengeId 챌린지 ID
 * @param selectedDate 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns 해당 날짜의 챌린지 인증 정보 배열
 */
export const getVerificationsByDate = async (challengeId: BigInt, selectedDate: string): Promise<ChallengeVerificationByDate[]> => {
    try {
        const response = await apiClient.get(`/challenge-verifications/${challengeId}`, {
            params: {
                selectedDate: selectedDate,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching verifications by date:", error);
        throw error;
    }
} 