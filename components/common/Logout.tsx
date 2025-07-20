import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout as logoutAPI } from '@/api/auth';

const Logout = ({ onLogout }: { onLogout: () => void }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

    const handleLogout = async () => {
        setIsLoading(true);
        
        try {
            // 백엔드 로그아웃 API 호출 (refresh token 삭제 및 쿠키 만료)
            await logoutAPI();
            
            // 로컬 스토리지에서 access token 삭제
            localStorage.removeItem('accessToken');
            
            // 성공 메시지 표시
            alert('성공적으로 로그아웃되었습니다.');
            
            // 상태 업데이트 및 홈페이지로 이동
            onLogout();
            router.push('/');
            
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
            
            // 에러가 발생해도 보안상 로컬 토큰은 삭제
            localStorage.removeItem('accessToken');
            
            // 사용자에게 알림 (에러가 있어도 로그아웃 처리)
            alert('로그아웃되었습니다.');
            
            // 상태 업데이트 및 홈페이지로 이동
            onLogout();
            router.push('/');
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading} // 로딩 중일 때 버튼 비활성화
            className={`px-4 py-2 text-white rounded font-semibold shadow-md ${
                isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600'
            }`}
        >
            {isLoading ? '로그아웃 중...' : '로그아웃'}
        </button>
    );
};

export default Logout;
