import { ACCESS_TOKEN } from '@/constants/global';

// JWT 토큰의 payload를 디코딩하는 함수
export function decodeJwtPayload(token: string): any {
  try {
    // JWT 토큰의 두 번째 부분(payload)을 추출
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    // 토큰 디코딩 실패 시 null 반환
    return null;
  }
}

// 토큰의 만료 시간을 확인하는 함수 (milliseconds 단위)
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    return null;
  }
  // exp는 초 단위이므로 밀리초로 변환
  return payload.exp * 1000;
}

// 토큰이 만료되었는지 확인하는 함수
export function isTokenExpired(token: string): boolean {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return true; // 만료 시간을 알 수 없으면 만료된 것으로 간주
  }
  return Date.now() >= expirationTime;
}

// 토큰이 곧 만료될 예정인지 확인하는 함수 (기본값: 5분 전)
export function isTokenExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return true; // 만료 시간을 알 수 없으면 곧 만료되는 것으로 간주
  }
  const bufferTime = bufferMinutes * 60 * 1000; // 분을 밀리초로 변환
  return Date.now() >= (expirationTime - bufferTime);
}

// 현재 저장된 토큰을 가져와서 유효성을 확인하는 함수
export function getCurrentTokenStatus(): {
  token: string | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
} {
  if (typeof window === 'undefined') {
    return { token: null, isExpired: true, isExpiringSoon: true };
  }

  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return { token: null, isExpired: true, isExpiringSoon: true };
  }

  return {
    token,
    isExpired: isTokenExpired(token),
    isExpiringSoon: isTokenExpiringSoon(token)
  };
} 