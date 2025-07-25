import apiClient from "./apiClient";
import { ChallengeMember } from "@/types/ChallengeMember";

/**
 * 챌린지 멤버 목록을 조회합니다
 * @param challengeId 챌린지 ID
 * @param date 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns 챌린지 멤버 목록
 */
export const getChallengeMembers = async (challengeId: number, date: string): Promise<ChallengeMember[]> => {
    try {
        const response = await apiClient.get(`/challenge-members/${challengeId}`, {
            params: { date }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};