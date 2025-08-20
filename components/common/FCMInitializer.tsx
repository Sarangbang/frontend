'use client';

import { useEffect } from 'react';
import { initializeFCM } from '@/lib/firebase';
import { ACCESS_TOKEN } from '@/constants/global';

const FCMInitializer = () => {
  useEffect(() => {
    // 로그인한 사용자만 FCM 초기화
    const initializeFCMIfLoggedIn = () => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
          initializeFCM().catch(() => {
            // FCM 초기화 실패는 조용히 처리
          });
        }
      }
    };

    // 페이지 로드 시 초기화
    initializeFCMIfLoggedIn();

    // localStorage 변경 감지 (로그인/로그아웃 시)
    const handleStorageChange = () => {
      initializeFCMIfLoggedIn();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
};

export default FCMInitializer; 