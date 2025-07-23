import { UpdateNicknameRequest, UpdatePasswordRequest, UpdateProfileImageRequest, UserProfileResponse } from "@/types/User";
import apiClient from "./apiClient";

// 로그인 된 사용자 정보 확인
export const getUserProfile = async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>("/users/me");
    return response.data;
}

// 비밀번호 변경
export const updatePassword = async (data: UpdatePasswordRequest) => {
  const response = await apiClient.patch("/users/me/password", data);
  return response.data;
}

// 닉네임 변경
export const updateNickname = async (data: UpdateNicknameRequest) => {
  const response = await apiClient.patch("/users/me/nickname", data);
  return response.data;
}

// 프로필 사진 변경
export const updateProfileImage = async (data: UpdateProfileImageRequest) => {
  const formData = new FormData();
  formData.append('file', data.avatar);

  const response = await apiClient.patch("/users/me/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// 프로필 사진 삭제
export const deleteProfileImage = async () => {
  const response = await apiClient.delete("/users/me/avatar");
  return response.data;
}