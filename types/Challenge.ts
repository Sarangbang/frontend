export type ChallengeStatus = "예정" | "진행중" | "종료";

export interface Challenge {
  id: number;
  status: boolean;
  location: string;
  title: string;
  currentParticipants: number;
  participants: number;
  category: string;
  categoryId?: number;
  categoryName?: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
}

export interface ChallengeCreateRequest {
  regionId: number;
  categoryId: number;
  title: string;
  description: string | null;
  participants: number | '';
  method: string;
  startDate: string;
  endDate: string;
  image: string | null;
  imageFile: File | null;
  status: boolean;
}

export interface ChallengeSummaryResponse {
  id: number;
  title: string;
  location: string;
  image: string;
  participants: number;
  category: string;
  currentParticipants: number;
  role: "owner" | "member";
  startDate: string;
  endDate: string;
  description: string;
  status: boolean;
}

export interface ChallengeFormData {
  categoryId: number;
  title: string;
  description: string;
  participants: number | '';
  verificationMethod: string;
  regionAddress: string;
  startDate: Date;
  endDate: Date;
  image: string | null;
  imageFile: File | null;
  duration: string;
  regionId: number | null;
}

export interface ChallengeDetail {
  challengeId: number;
  title: string;
  description:string;
  imageUrl: string;
  method: string;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  challengeStatus: 'ACTIVE' | 'INACTIVE';
  location: string;
  category: {
    categoryId: number;
    categoryName: string;
    imageUrl: string;
  };
}

export interface ChallengeJoinRequest {
  introduction: string;
  reason: string;
  commitment: string;
  challengeId: number;
}

// Spring Boot Page 객체 구조에 맞는 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ChallengeVerificationByDate {
  verificationId: number | null;
  userId: string;
  imgUrl: string | null;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  nickname: string;
  role: 'owner' | 'member';
  content: string | null;
  verifiedAt: string | null;
}

// 인기 챌린지 조회
export interface PopularChallengeResponse {
  challengeId: number;
  challengeTitle: string;
  image: string;
  region: string;
  currentParticipants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  categoryName: string;
}