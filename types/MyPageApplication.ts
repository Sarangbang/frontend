export type ChallengeApplyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MyPageApplication {
    applicationId: number;
    introduction: string;
    reason: string;
    commitment: string;
    challengeApplyStatus: ChallengeApplyStatus;
    comment?: string | null;
    
    challengeId: number;
    challengeTitle: string;
    challengeDescription: string;
    currentParticipants: number;
    maxParticipants: number;
    imageUrl?: string | null;
    location: string;

    // 화면에 바로 쓸 수 있는 제목
    challengeDisplayTitle: string;
}