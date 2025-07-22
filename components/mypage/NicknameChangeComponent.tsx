'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { updateNickname, getUserProfile } from '@/api/mypage';
import { useUserStore } from '@/lib/store/userStore';
import Image from 'next/image';

export default function NicknameChangeComponent() {
  const router = useRouter();
  const { user } = useUserStore();
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setNewNickname(data.nickname || '');
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
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
      
      // 닉네임 변경 완료 상태와 함께 마이페이지로 이동
      router.push('/mypage?nickname_updated=true');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '닉네임 변경에 실패했습니다.';
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
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
      </div>
    </div>
  );
} 