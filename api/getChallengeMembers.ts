import apiClient from "./apiClient";

export default async function getChallengeMembers(challengeId: BigInt, date: string) {
    const response = await apiClient.get(`/challenge-members/${challengeId}`, {
        params: { date }
    });
    return response.data;
}