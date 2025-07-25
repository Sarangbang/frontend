'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  CameraIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import Logout from '../common/Logout';
import Sidebar from '../common/Sidebar';
import BottomNav from '../common/BottomNav';
import { useMediaQuery } from 'react-responsive';
import { getUserProfile, updatePassword, updateProfileImage, deleteProfileImage, updateRegion } from '@/api/mypage';
import { UserProfileResponse } from '@/types/User';
import RegionSelectForm from '../signup/RegionSelectForm';

export default function MyPageComponent() {
  const [activeTab, setActiveTab] = useState('info');
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  // 비밀번호 변경 관련 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [isEditingRegion, setIsEditingRegion] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedRegionAddress, setSelectedRegionAddress] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPasswordMessage(null); // 탭 변경 시 비밀번호 관련 메시지 초기화
  };

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setUserProfile(data);
    } catch (error) {
      setToastMessage('사용자 정보를 불러오는 데 실패하였습니다.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [pathname]); // pathname이 변경될 때마다 프로필 정보를 다시 불러옵니다.

  useEffect(() => {
    // 닉네임 변경 완료 상태 확인
    const isNicknameUpdated = localStorage.getItem('nickname_updated');
    if (isNicknameUpdated === 'true') {
      setToastMessage('닉네임 변경이 완료되었습니다!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      // 상태 초기화
      localStorage.removeItem('nickname_updated');
    }
  }, []);

  const changePassword = async() => {
    setIsLoading(true);
    setPasswordMessage(null); // 메시지 초기화
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
      const errorMessage = err?.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      setPasswordMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCameraClick = () => {
    setIsActionSheetOpen(true);
  };

  const closeActionSheet = () => {
    setIsActionSheetOpen(false);
  };

  const handleSelectFromAlbum = () => {
    fileInputRef.current?.click();
    closeActionSheet();
  };

  const handleDeleteProfileImage = async () => {
    try {
      await deleteProfileImage();
      
      setUserProfile((prev) =>
        prev
          ? { ...prev, profileImageUrl: '/images/charactors/gamza.png' }
          : null,
      );
      
      setToastMessage('프로필 사진이 삭제되었습니다.');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
    } catch (error) {
      setToastMessage('프로필 사진 삭제에 실패했습니다.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      closeActionSheet();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const response = await updateProfileImage({ avatar: file });
        
        // UI 즉시 업데이트
        const previewUrl = URL.createObjectURL(file);
        setUserProfile((prev) =>
          prev ? { ...prev, profileImageUrl: previewUrl } : null,
        );
        
        setToastMessage('프로필 사진이 변경되었습니다.');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
        
      } catch (error) {
        setToastMessage('프로필 사진 변경에 실패했습니다.');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    }
  };

  const handleRegionEditClick = () => {
    setIsEditingRegion(true);
  };

  const handleRegionUpdate = async () => {
    if (selectedRegionId && selectedRegionAddress) {
      try {
        await updateRegion({ regionId: selectedRegionId });
        
        setUserProfile(prev => prev ? { ...prev, region: selectedRegionAddress } : null);
        setIsEditingRegion(false);
        
        setToastMessage('지역이 성공적으로 변경되었습니다.');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

      } catch (error) {
        setToastMessage('지역 변경에 실패했습니다.');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } else {
      setToastMessage('변경할 지역을 선택해주세요.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleRegionSelect = (regionId: number | null, fullAddress: string) => {
    setSelectedRegionId(regionId);
    setSelectedRegionAddress(fullAddress);
  };

  const handleRegionCancel = () => {
    setIsEditingRegion(false);
  };

  const hasCustomProfileImage =
    userProfile?.profileImageUrl &&
    !userProfile.profileImageUrl.includes('gamza.png');

  const myPageContent = (
    <>
      <main className="flex-grow flex flex-col items-center w-full p-6 space-y-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <Image
              src={userProfile?.profileImageUrl || '/images/charactors/gamza.png'}
              alt="Profile"
              width={112}
              height={112}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <div
            className="absolute bottom-0 right-0 bg-gray-300 dark:bg-gray-600 p-1 rounded-full cursor-pointer"
            onClick={handleCameraClick}
          >
            <CameraIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </div>

          {/* 데스크톱용 액션 시트 */}
          {isDesktop && isActionSheetOpen && (
            <div
              className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {hasCustomProfileImage && (
                <>
                  <button
                    onClick={handleDeleteProfileImage}
                    className="w-full text-left p-3 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-xl"
                  >
                    프로필 사진 삭제
                  </button>
                  <hr className="border-gray-200 dark:border-gray-700" />
                </>
              )}
              <button
                onClick={handleSelectFromAlbum}
                className="w-full text-left p-3 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl"
              >
                앨범에서 선택
              </button>
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold dark:text-white">
            {userProfile?.nickname || '로딩중...'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {userProfile?.email || '로딩중...'}
          </p>
        </div>

        <div className="flex w-full">
          <button
            onClick={() => handleTabChange('info')}
            className={`flex-1 py-2 text-center rounded-l-lg ${
              activeTab === 'info'
                ? 'bg-gray-300 dark:bg-gray-600 font-semibold'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            내 정보
          </button>
          <button
            onClick={() => handleTabChange('password')}
            className={`flex-1 py-2 text-center rounded-r-lg ${
              activeTab === 'password'
                ? 'bg-gray-300 dark:bg-gray-600 font-semibold'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            비밀번호 변경
          </button>
        </div>

        <div
          className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl border"
          style={{ borderColor: '#d9d9d9' }}
        >
          {activeTab === 'info' && (
            isEditingRegion ? (
              <RegionSelectForm 
                onRegionSelect={(regionId, fullAddress) => {
                  setSelectedRegionId(regionId);
                  setSelectedRegionAddress(fullAddress);
                }}
                onCancel={handleRegionCancel}
                onSubmit={handleRegionUpdate}
                initialFullAddress={userProfile?.region}
                showButtons={true}
              />
            ) : (
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
                    <p className="dark:text-white">
                      {userProfile?.nickname || '로딩중...'}
                    </p>
                    <ArrowTopRightOnSquareIcon
                      className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => {
                        router.push('/mypage/nickname');
                      }}
                    />
                  </div>
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
                    <p className="dark:text-white">
                      {userProfile?.region || '로딩중...'}
                    </p>
                    <ArrowTopRightOnSquareIcon
                      className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={handleRegionEditClick}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Logout
                    onLogout={() => {
                      router.push('/login');
                    }}
                  />
                </div>
              </div>
            )
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
                  onChange={(e) => setCurrentPassword(e.target.value)}
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
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  onChange={(e) => setNewPasswordCheck(e.target.value)}
                />
              </div>
              {passwordMessage && (
                <div className="text-center text-sm mt-2 text-red-500 dark:text-red-400">
                  {passwordMessage}
                </div>
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
    <>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {showToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className={`px-6 py-3 rounded-lg shadow-lg ${
                toastType === 'success'
                  ? 'bg-gray-800 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {toastMessage}
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
      {/* 모바일용 액션 시트 */}
      {!isDesktop && isActionSheetOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-end"
          onClick={closeActionSheet}
        >
          <div
            className="w-full sm:max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-2 mb-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl">
                {hasCustomProfileImage && (
                  <>
                    <button
                      onClick={handleDeleteProfileImage}
                      className="w-full text-center p-3 text-red-500 dark:text-red-400"
                    >
                      프로필 사진 삭제
                    </button>
                    <hr className="border-gray-200 dark:border-gray-700" />
                  </>
                )}
                <button
                  onClick={handleSelectFromAlbum}
                  className="w-full text-center p-3 text-blue-500 dark:text-blue-400"
                >
                  앨범에서 선택
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl mt-2">
                <button
                  onClick={closeActionSheet}
                  className="w-full text-center p-3 text-blue-500 dark:text-blue-400 font-semibold"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}