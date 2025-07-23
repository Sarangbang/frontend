'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';

const AuthSuccessClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useUserStore();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const uuid = searchParams.get('uuid');
        const nickname = searchParams.get('nickname');
        const profileImageUrl = searchParams.get('profileImageUrl');
        const profileComplete = searchParams.get('profileComplete');

        // 필수 파라미터들이 모두 있는지 확인
        if (accessToken && uuid && nickname) {
            // 액세스 토큰을 localStorage에 저장
            localStorage.setItem('am', accessToken);
            
            // 사용자 정보를 userStore에 저장
            setUser({
                uuid,
                nickname,
                profileImageUrl: profileImageUrl || null
            });

            // 프로필 완성 상태에 따라 리디렉션
            if (profileComplete === 'true') {
                router.push('/');
            } else if (profileComplete === 'false') {
                router.push('/signup/details');
            } else {
                // profileComplete 파라미터가 없는 예외적인 경우
                console.error("프로필 완성 상태 정보가 없습니다.");
                router.push('/login');
            }
        } else {
            // 필수 파라미터가 누락된 경우
            console.error("인증 처리 중 필수 정보가 누락되었습니다.");
            router.push('/login');
        }
    }, [router, searchParams, setUser]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p className="text-lg font-semibold">로그인 처리 중입니다...</p>
                <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
            </div>
        </div>
    );
};

export default AuthSuccessClient; 