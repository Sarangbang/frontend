export interface User {
  userId: string;
  name: string;
  email: string;
  profileImageUrl: string;
}

export interface UserProfileResponse {
  email: string;
  nickname: string;
  profileImageUrl: string;
  gender: string;
  region: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordCheck: string;
}

export interface UpdateProfileImageRequest {
  avatar: File;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateRegionRequest {
  regionId: number;
}
