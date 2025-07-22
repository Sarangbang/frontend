'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  CameraIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Logout from '../common/Logout';
import Sidebar from '../common/Sidebar';
import BottomNav from '../common/BottomNav';
import { useMediaQuery } from 'react-responsive';
import { getUserProfile, updatePassword } from '@/api/mypage';
import { UserProfileResponse } from '@/types/User';

export default function MyPageComponent() {
  const [activeTab, setActiveTab] = useState('info');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // 비밀번호 변경 관련 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [pathname]); // pathname이 변경될 때마다 프로필 정보를 다시 불러옵니다.

  useEffect(() => {
    // URL 파라미터에서 nickname_updated 확인
    if (searchParams.get('nickname_updated') === 'true') {
      setShowToast(true);
      // 3초 후 토스트 메시지 숨김
      setTimeout(() => {
        setShowToast(false);
        // URL에서 파라미터 제거
        router.replace('/mypage');
      }, 3000);
    }
  }, [searchParams, router]);

  const changePassword = async() => {
    if (newPassword !== newPasswordCheck) {
      setPasswordMessage('새 비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }
    if(newPassword.length < 8 || newPasswordCheck.length < 8) {
      setPasswordMessage('비밀번호는 최소 8자 이상 입력해주세요.');
      setIsLoading(false);
      return;
    }
    try {
      const res = await updatePassword({
        currentPassword,
        newPassword,
        newPasswordCheck,
      });
      setPasswordMessage(res.message || '비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordCheck('');
    } catch (err: any) {
      let msg = '비밀번호 변경에 실패했습니다.';
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data.message) {
          msg = err.response.data.message;
        }
      }
      setPasswordMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const myPageContent = (
    <>
      <main className="flex-grow flex flex-col items-center w-full p-6 space-y-6">
        <div className="relative">
          <Image
            src={userProfile?.profileImageUrl || '/images/charactors/gamza.png'}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-gray-300 p-1 rounded-full cursor-pointer">
            <CameraIcon className="w-5 h-5 text-gray-800" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold dark:text-white">
            {userProfile?.nickname || '로딩중...'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{userProfile?.email || '로딩중...'}</p>
        </div>

        <div className="flex w-full">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 text-center rounded-l-lg ${
              activeTab === 'info'
                ? 'bg-gray-300 dark:bg-gray-600 font-semibold'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            내 정보
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 text-center rounded-r-lg ${
              activeTab === 'password'
                ? 'bg-gray-300 dark:bg-gray-600 font-semibold'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            비밀번호 변경
          </button>
        </div>

        <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl border" style={{ borderColor: '#d9d9d9' }}>
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500">이메일</label>
                <p className="dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  {userProfile?.email || '로딩중...'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">닉네임</label>
                <div className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                  <p className="dark:text-white">{userProfile?.nickname || '로딩중...'}</p>
                  <ArrowTopRightOnSquareIcon
                    className="w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => router.push('/mypage/nickname')}
                  />
                </div>
                {successMessage && (
                  <p className="text-sm mt-2 text-green-500">{successMessage}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-500">성별</label>
                <p className="dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  {userProfile?.gender || '로딩중...'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">지역</label>
                <div className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                  <p className="dark:text-white">{userProfile?.region || '로딩중...'}</p>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
              </div>
              <div className="pt-4">
                <Logout onLogout={() => { router.push('/login') }} />
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  style={{ borderColor: '#d9d9d9' }}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  style={{ borderColor: '#d9d9d9' }}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  style={{ borderColor: '#d9d9d9' }}
                  value={newPasswordCheck}
                  onChange={e => setNewPasswordCheck(e.target.value)}
                />
              </div>
              {passwordMessage && (
                <div className="text-center text-sm mt-2 text-red-500 dark:text-red-400">{passwordMessage}</div>
              )}
              <div className="pt-4">
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
                  onClick={changePassword}
                  disabled={isLoading}
                >
                  {isLoading ? '변경 중...' : '변경하기'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {!isDesktop && <BottomNav />}
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
            닉네임 변경이 완료되었습니다!
          </div>
        </div>
      )}
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:ml-64">
            <div className="max-w-2xl mx-auto py-8">
              <header className="px-4">
                <h1 className="text-2xl font-bold dark:text-white">MyPage</h1>
              </header>
              {myPageContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 flex flex-col">
          <header className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <button onClick={() => router.back()}>
                <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
              <h1 className="text-xl font-bold dark:text-white">MyPage</h1>
            </div>
          </header>
          {myPageContent}
        </div>
      )}
    </div>
  );
}