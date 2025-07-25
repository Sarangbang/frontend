export interface ChallengeMember {
    id: number; // 챌린지 멤버 ID
    nickname: string; // 사용자 닉네임
    role: string; // 사용자 역할 (owner, member 등)
    challengeTitle: string; // 챌린지 제목
    challengeMethod: string; // 챌린지 인증 방법
    status: boolean; // 해당 날짜의 인증 여부
    profileImageUrl?: string; // 프로필 이미지 (백엔드 수정으로 추가됨)
    userRegion?: string; // 사용자 지역 (백엔드 수정으로 추가됨)
} 