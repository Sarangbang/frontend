'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';

// 애플리케이션 시작 시 토큰 유효성을 확인하는 컴포넌트
export default function TokenValidator() {
  const checkTokenValidity = useUserStore((state) => state.checkTokenValidity);

  useEffect(() => {
    // 컴포넌트 마운트 시 토큰 유효성 확인
    checkTokenValidity();
  }, [checkTokenValidity]);

  // UI는 렌더링하지 않음
  return null;
} 