export interface ChallengeApplication {
    applicationId: number;
    userId: string;
    nickname: string;
    location: string;
    appliedAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}