// 회원가입 요청 타입
export interface SignUpRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  regionId: number;
  nickname: string;
}

export interface SignUpResponse {
}