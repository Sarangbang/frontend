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
  categoryId: number | null;
  title: string;
  description: string;
  location: string;
  participants: number;
  verificationMethod: string;
  startDate: string;
  endDate: string;
  image: string | null;
  status: boolean;
}

export interface ChallengeFormData {
  categoryId: number | null;
  title: string;
  description: string;
  participants: number;
  verificationMethod: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  image: File | null;
}

export const initialFormData: ChallengeFormData = {
  categoryId: 0,
  title: '',
  description: '',
  participants: 0,
  verificationMethod: '',
  startDate: new Date(),
  endDate: new Date(),
  duration: '',
  image: null,
};