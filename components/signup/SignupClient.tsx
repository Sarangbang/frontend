'use client';

import { useState } from 'react';
import SignUpForm from './SignUpForm';
import RegionSelectForm from './RegionSelectForm';
import { SignUpRequest } from '@/types/SignUp';
import { signUp } from '@/api/signup';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const SignupClient = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SignUpRequest>>({
    email: '',
    password: '',
    passwordConfirm: '',
    gender: '',
    nickname: '',
    regionId: undefined,
  });

  const handleNext = (data: Partial<SignUpRequest>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleRegionSelect = (regionId: number | null) => {
    setFormData(prev => ({ ...prev, regionId: regionId ?? undefined }));
    setError(null); // 지역 선택 시 에러 메시지 제거
  };

  const handleSubmit = async () => {
    setError(null);
    if (!formData.regionId) {
      setError('지역을 선택해주세요.');
      return;
    }
    try {
      await signUp(formData as SignUpRequest);
      alert('회원가입이 완료되었습니다');
      router.push('/login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (error.response.status === 400) {
          const errorMessage = Object.values(errorData)[0] as string;
          setError(errorMessage);
        } else if (error.response.status === 409) {
          if (errorData.email) {
            setError(errorData.email);
          } else if (errorData.nickname) {
            setError(errorData.nickname);
          } else {
            setError('이미 사용 중인 정보가 있습니다. 다시 확인해주세요.');
          }
        } else {
          setError(
            '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          );
        }
      } else {
        setError('서버와 통신할 수 없습니다. 인터넷 연결을 확인해주세요.');
      }
    }
  };

  const isJoinEnabled = !!formData.regionId;

  return (
    <>
      {step === 1 && <SignUpForm onNext={handleNext} initialData={formData} />}
      {step === 2 && (
        <div className="flex flex-col justify-center min-h-screen bg-white sm:px-6 lg:px-8 dark:bg-gray-900 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex flex-col items-center">
              <Image
                src="/images/charactors/gamza.png"
                alt="일심동네 로고"
                width={80}
                height={80}
              />
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
                일심동네
              </h2>
              <p className="mt-2 text-sm font-semibold text-orange-600">
                같은 동네, 같은 마음 함께 만드는 습관
              </p>
            </div>
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
              <RegionSelectForm
                onRegionSelect={handleRegionSelect}
                // initialRegionId={formData.regionId} // TODO: 추후 구현
              />

              <div className="min-h-[48px] flex items-center mt-4">
                {error && (
                  <div className="w-full p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <button
                  className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  onClick={handleSubmit}
                >
                  회원가입(2/2)
                </button>
                <button
                  type="button"
                  className="flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  onClick={handlePrev}
                >
                  이전
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupClient; 