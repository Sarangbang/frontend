'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthSuccessClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const profileComplete = searchParams.get('profileComplete');

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }

        if (profileComplete === 'true') {
            router.push('/');
        } else if (profileComplete === 'false') {
            router.push('/signup/details');
        } else {
            // accessToken은 있는데 profileComplete이 없는 예외적인 경우
            // 혹은 둘 다 없는 경우
            console.error("인증 처리 중 문제가 발생했습니다.");
            router.push('/login');
        }
    }, [router, searchParams]);

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