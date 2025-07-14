export interface Challenge {
  id: number;
  status: '예정' | '진행중' | '종료';
  location: string;
  title: string;
  currentParticipants: number;
  participants: number; // 최대 참여자 수 (백엔드의 participants와 매칭)
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
}

export interface ChallengeCreateRequest {
  location: string;
  title: string;
  description: string;
  participants: number;
  method: string;
  startDate: string;
  endDate: string;
  image: string;
  status: boolean;
  categoryId: number;
}

export interface ChallengeFormData {
  category: number;
  title: string;
  description: string;
  participants: number;
  verificationMethod: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  image: File | null;
}

const initialFormData: ChallengeFormData = {
  category: 0,
  title: '',
  description: '',
  participants: 0,
  verificationMethod: '',
  startDate: new Date(),
  endDate: new Date(),
  duration: '',
  image: null,
};

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