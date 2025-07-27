export interface ChallengeApplication {
    id: number; // applicationId -> id로 변경
    userId: string;
    userNickname: string; // nickname -> userNickname으로 변경
    userProfileImageUrl?: string; // profileImage -> userProfileImageUrl로 변경
    userRegion: string; // location -> userRegion으로 변경
    createdAt: string; // appliedAt -> createdAt로 변경
    challengeApplyStatus: 'PENDING' | 'APPROVED' | 'REJECTED'; // status -> challengeApplyStatus로 변경
    introduction?: string;
    reason?: string;
    commitment?: string;
    comment?: string; // 방장 코멘트 필드 추가
}