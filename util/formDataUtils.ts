import { SignUpRequest } from '@/types/SignUp';

/**
 * SignUpRequest 객체를 FormData 객체로 변환합니다.
 * 이 함수는 순수 함수로, 네트워크 요청이나 다른 부수 효과(side effect)가 없습니다.
 * @param data - 회원가입 폼 데이터 (SignUpRequest 타입)
 * @returns FormData 객체
 */
export const createSignUpFormData = (data: SignUpRequest): FormData => {
  const formData = new FormData();

  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('passwordConfirm', data.passwordConfirm);
  formData.append('gender', data.gender);
  formData.append('nickname', data.nickname);
  formData.append('regionId', data.regionId.toString());

  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }
  return formData;
};