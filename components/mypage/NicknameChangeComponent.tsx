'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { updateNickname, getUserProfile } from '@/api/mypage';
import { useUserStore } from '@/lib/store/userStore';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '../common/Sidebar';

export default function NicknameChangeComponent() {
  const router = useRouter();
  const { user } = useUserStore();
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setNewNickname(data.nickname || '');
      } catch (error) {
        setToastMessage('닉네임 정보를 불러오는 데 실패하였습니다.');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNicknameUpdate = async () => {
    if (!newNickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    try {
      const res = await updateNickname({ nickname: newNickname });
      
      // localStorage user-storage 업데이트
      const userStorage = localStorage.getItem('user-storage');
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        userData.state.user.nickname = newNickname;
        localStorage.setItem('user-storage', JSON.stringify(userData));
      }

      // 닉네임 변경 완료 상태 저장
      localStorage.setItem('nickname_updated', 'true');
      
      // 마이페이지로 이동
      router.push('/mypage');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '닉네임 변경에 실패했습니다.';
      setErrorMessage(errorMessage);
    }
  };

  const pageContent = (
    <>
      {/* 프로필 이미지 */}
      <div className="flex justify-center mt-8">
        <div className="relative">
          <Image
            src={user?.profileImageUrl || '/images/charactors/gamza.png'}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-gray-300 dark:bg-gray-600 p-1 rounded-full cursor-pointer">
            <CameraIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </div>
        </div>
      </div>

      {/* 닉네임 입력 */}
      <div className="px-4 mt-8">
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
          닉네임
        </label>
        <input
          type="text"
          value={newNickname}
          onChange={(e) => {
            setNewNickname(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 border rounded focus:outline-none"
          style={{ borderColor: '#d9d9d9' }}
          placeholder="닉네임을 입력하세요"
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errorMessage}</p>
        )}
      </div>

      {/* 완료 버튼 - 데스크톱 버전에서만 표시 */}
      {isDesktop && (
        <div className="px-4 mt-8">
          <button
            onClick={handleNicknameUpdate}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            완료
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:ml-64">
            <div className="max-w-2xl mx-auto py-8">
              <header className="px-4 mb-6">
                <h1 className="text-2xl font-bold dark:text-white">프로필 수정</h1>
              </header>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border p-6" style={{ borderColor: '#d9d9d9' }}>
                {pageContent}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {/* 모바일 헤더 */}
          <header className="flex items-center justify-between px-4 py-3">
            <button onClick={() => router.back()}>
              <XMarkIcon className="w-6 h-6 text-gray-900 dark:text-gray-200" />
            </button>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">프로필 수정</h1>
            <button
              onClick={handleNicknameUpdate}
              className="text-sm text-gray-900 dark:text-white"
            >
              완료
            </button>
          </header>
          {pageContent}
        </div>
      )}
    </div>
  );
} 