// 회원가입 요청 타입
export interface SignUpRequest {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
    gender: string;
    region: string;
}