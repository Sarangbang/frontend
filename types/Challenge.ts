export interface Challenge {
  id: number;
  status: '예정' | '진행중' | '종료';
  location: string;
  title: string;
  currentParticipants: number;
  maxParticipants: number;
  category: string;
  description: string;
  period: string;
  participants: string;
  startDate: string;
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
  image: File | null | string;
  duration: string;
  regionId: number | null;
}
