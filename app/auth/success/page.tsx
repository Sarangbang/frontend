import { Suspense } from 'react';
import AuthSuccessClient from './AuthSuccessClient';

const AuthSuccessPage = () => {
    const loadingFallback = (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p className="text-lg font-semibold">로그인 처리 중입니다...</p>
                <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
            </div>
        </div>
    );

    return (
        <Suspense fallback={loadingFallback}>
            <AuthSuccessClient />
        </Suspense>
    );
};

export default AuthSuccessPage; 