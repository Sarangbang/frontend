// 회원가입 요청 타입
export interface SignUpRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  regionId: number;
  nickname: string;
  profileImage?: File; // 프로필 이미지 파일 추가
}

export interface SignUpResponse {
}