'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import RegionSelectForm from './RegionSelectForm';
import apiClient from '@/api/apiClient';

const ProfileSetupForm = () => {
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [regionId, setRegionId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegionSelect = (selectedRegionId: number | null) => {
        setRegionId(selectedRegionId);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || !regionId) {
            toast.error('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.patch('/users/me', {
                nickname,
                gender,
                regionId: regionId,
            });
            toast.success('프로필 설정이 완료되었습니다!');
            router.push('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '프로필 설정 중 오류가 발생했습니다.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-screen py-12 bg-white sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
                    추가 정보 입력
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                    서비스 이용을 위해 추가 정보를 입력해주세요.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                닉네임
                            </label>
                            <input
                                id="nickname"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">성별</label>
                            <div className="flex items-center mt-2 space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="gender" value="MALE" onChange={(e) => setGender(e.target.value)} required className="text-orange-600 focus:ring-orange-500"/>
                                    <span className="ml-2 text-gray-700 dark:text-gray-200">남성</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="gender" value="FEMALE" onChange={(e) => setGender(e.target.value)} required className="text-orange-600 focus:ring-orange-500"/>
                                    <span className="ml-2 text-gray-700 dark:text-gray-200">여성</span>
                                </label>
                            </div>
                        </div>
                        
                        <RegionSelectForm onRegionSelect={handleRegionSelect} />

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {isLoading ? '설정 중...' : '가입 완료'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetupForm; 