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
  title: string;
  description: string;
  participants: number;
  method: string;
  startDate: string;
  endDate: string;
  image: string;
  status: boolean;
  categoryId: number;
  regionId: number;
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
  regionId: number | null;
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
  regionId: null,
};