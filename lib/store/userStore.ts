import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/Login';

interface UserState {
  user: User | null; // 사용자 정보 (uuid, profileImageUrl)
  isLoggedIn: boolean; // 로그인 상태
  setUser: (user: User) => void; // 사용자 정보 설정
  clearUser: () => void; // 사용자 정보 삭제 (로그아웃)
}

// 사용자 정보를 localStorage에 지속적으로 저장하는 Zustand 스토어
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      // 사용자 정보 설정 (로그인 시)
      setUser: (user: User) => set({ user, isLoggedIn: true }),
      
      // 사용자 정보 삭제 (로그아웃 시)
      clearUser: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage', // localStorage 키 이름
    }
  )
); 