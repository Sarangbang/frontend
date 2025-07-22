import { UpdateNicknameRequest, UpdatePasswordRequest, UserProfileResponse } from "@/types/User";
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