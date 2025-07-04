import apiClient from './apiClient';

// 회원가입 요청 타입
export interface SignUpRequest {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
    gender: string;
    region: string;
}

export interface SignUpResponse {
}

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await apiClient.post<SignUpResponse>('/users/signup', data);
    return response.data;
};