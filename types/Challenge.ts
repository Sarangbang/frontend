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
  category: string;
  title: string;
  description: string;
  participants: string; // 👈 input으로 받아서 string인 상태
  verificationMethod: string;
  verificationFrequency: string;
  verificationCountPerDay: string;
  startDate: Date;
  duration: string;
  image: File | null;
}

export const initialFormData: ChallengeFormData = {
  category: '',
  title: '',
  description: '',
  participants: '',
  verificationMethod: '',
  verificationFrequency: '',
  verificationCountPerDay: '',
  startDate: new Date(),
  duration: '',
  image: null,
};