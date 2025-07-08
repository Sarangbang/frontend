// 로그인 요청 타입
export interface LoginRequest {
    email: string;
    password: string;
  }
  
// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  message: string;
}