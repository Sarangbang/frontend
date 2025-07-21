import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout as logoutAPI } from '@/api/auth';
import { useUserStore } from '@/lib/store/userStore';
import { toast } from 'react-hot-toast';

const Logout = ({ onLogout }: { onLogout: () => void }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
    const { clearUser } = useUserStore(); // Zustand 스토어에서 clearUser 함수 가져오기

    const handleLogout = async () => {
        setIsLoading(true);
        
        try {
            // 백엔드 로그아웃 API 호출 (refresh token 삭제 및 쿠키 만료)
            await logoutAPI(); 

            toast.success('성공적으로 로그아웃되었습니다.');

        } catch (error) { 
            toast.success('로그아웃되었습니다.');
            
        } finally {
            // 로컬 스토리지에서 access token 삭제
            localStorage.removeItem('am');
                        
            // Zustand 스토어에서 사용자 정보 삭제
            clearUser();

            // 상태 업데이트 및 홈페이지로 이동
            onLogout();
            router.push('/');

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
