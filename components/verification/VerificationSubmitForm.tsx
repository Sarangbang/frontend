'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, CloudArrowUpIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Sidebar from '@/components/common/Sidebar';
import { submitVerification } from '@/api/verification';

const VerificationSubmitForm = ({ challengeId }: { challengeId: string }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Fetch challenge details based on challengeId
  const challengeTitle = '책..읽읍시다'; 

  useEffect(() => {
    setIsClient(true);
    // 컴포넌트 언마운트 시 메모리 누수 방지를 위해 object URL 해제
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  }

  const handleSubmit = async () => {
    if (!image) {
      alert("이미지를 등록해주세요.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', image);
    // formData.append('challengeId', challengeId); // 백엔드 API 사양에 따라 추가

    try {
      await submitVerification(formData);
      alert('인증이 성공적으로 제출되었습니다.');
      router.push(`/challenge/${challengeId}`); // 성공 시 챌린지 상세 페이지로 이동
    } catch (error) {
      alert('인증 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainContent = (
    <div className="p-4 flex flex-col h-full">
      <div className="flex-grow flex flex-col">
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">인증사진</h2>
          <div className="flex items-center justify-center w-full">
            {imagePreview ? (
              <div className="relative w-full aspect-[4/3]">
                <Image src={imagePreview} alt="업로드 이미지 미리보기" layout="fill" className="rounded-lg object-contain" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-white rounded-full">
                  <XCircleIcon className="w-7 h-7 text-gray-700 hover:text-gray-900"/>
                </button>
              </div>
            ) : (
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudArrowUpIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">사진을 업로드하세요.</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG 파일 (최대 10MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <button
          onClick={handleSubmit}
          disabled={!image || isSubmitting}
          className="w-full bg-[#F47150] text-white font-bold py-3 rounded-lg mt-6 hover:bg-[#d96443] transition-colors disabled:bg-[#F4715080]"
        >
          {isSubmitting ? '제출 중...' : '인증 완료하기'}
        </button>
      </div>
    </div>
  );

  if (!isClient) return null;

  return (
    <>
      {isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="w-2/4 mx-auto pt-8">
               <div className="flex items-center mb-8">
                <Image src="/images/charactors/Rectangle.png" alt={challengeTitle} width={32} height={32} className="mr-3" />
                <h1 className="text-3xl font-bold dark:text-white">{challengeTitle}</h1>
              </div>
              {mainContent}
            </main>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 flex flex-col h-screen">
          <header className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="mr-4">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
              <Image src="/images/charactors/Rectangle.png" alt={challengeTitle} width={24} height={24} className="mr-2" />
              <h1 className="text-xl font-bold dark:text-white">{challengeTitle}</h1>
            </div>
          </header>
          {mainContent}
        </div>
      )}
    </>
  );
};

export default VerificationSubmitForm; 