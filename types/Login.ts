// 로그인 요청 타입
export interface LoginRequest {
    email: string;
    password: string;
}
  
// 로그인 응답 타입 (백엔드 응답에 맞게 수정)
export interface LoginResponse {
    accessToken: string;
    message: string;
}

// 토큰 재발급 응답 타입
export interface RefreshTokenResponse {
    accessToken: string;
}