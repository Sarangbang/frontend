export interface TodayVerificationStatusResponse {
    challengeId: number;
    title: string;
    location: string;
    image: string;
    participants: number;
    currentParticipants: number;
    verifyStatus: boolean;
    startDate: string;
    endDate: string;
}

export interface VerificationCreateRequest {
	challengeId: number;
	imgUrl: string;
	content: string;
};

export type ChallengeVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface VerificationResponse {
    challengeId: number;
    verifiedAt: string; // LocalDateTime → string
    imgUrl: string;
    content: string;
    status: ChallengeVerificationStatus;
    userId: string;
}

export interface Verification {
  imgUrl: string;
  title: string;
  verifiedAt: string;
} 
