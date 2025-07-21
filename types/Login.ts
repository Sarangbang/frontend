// 로그인 요청 타입
export interface LoginRequest {
    email: string;
    password: string;
}

// 사용자 정보 타입
export interface User {
    uuid: string;
    nickname: string;
    profileImageUrl: string | null;
}
  
// 로그인 응답 타입 (백엔드 LoginResponseDto에 맞게 수정)
export interface LoginResponse {
    uuid: string;
    nickname: string;
    profileImageUrl: string | null;
    accessToken: string;
}

// 토큰 재발급 응답 타입
export interface RefreshTokenResponse {
    accessToken: string;
}