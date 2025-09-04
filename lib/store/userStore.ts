import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/Login';
import { ACCESS_TOKEN } from '@/constants/global';
import { isTokenExpired } from '@/util/tokenUtils';

interface UserState {
  user: User | null; // 사용자 정보 (uuid, profileImageUrl)
  isLoggedIn: boolean; // 로그인 상태
  setUser: (user: User) => void; // 사용자 정보 설정
  clearUser: () => void; // 사용자 정보 삭제 (로그아웃)
  checkTokenValidity: () => void; // 토큰 유효성 확인
}

// 사용자 정보를 localStorage에 지속적으로 저장하는 Zustand 스토어
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      
      // 사용자 정보 설정 (로그인 시)
      setUser: (user: User) => set({ user, isLoggedIn: true }),
      
      // 사용자 정보 삭제 (로그아웃 시)
      clearUser: () => {
        // localStorage에서 토큰도 함께 삭제
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ACCESS_TOKEN);
        }
        set({ user: null, isLoggedIn: false });
      },
      
      // 애플리케이션 시작 시 토큰 유효성 확인
      checkTokenValidity: () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem(ACCESS_TOKEN);
        const currentState = get();
        
        // 토큰이 없는 경우에만 사용자 상태 초기화
        // 토큰이 만료되었어도 refresh token으로 갱신 가능하므로 바로 로그아웃하지 않음
        if (!token && currentState.isLoggedIn) {
          set({ user: null, isLoggedIn: false });
        }
      },
    }),
    {
      name: 'user-storage', // localStorage 키 이름
    }
  )
); 