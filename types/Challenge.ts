export type ChallengeStatus = "예정" | "진행중" | "종료";

export interface Challenge {
  id: number;
  status: ChallengeStatus;
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
