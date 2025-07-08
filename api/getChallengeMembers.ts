import apiClient from "./apiClient";

export default async function getChallengeMembers(challengeId: BigInt) {
    const response = await apiClient.get(`/challenge-members/${challengeId}`)
    return response.data
}