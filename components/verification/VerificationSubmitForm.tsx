'use client';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, CloudArrowUpIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Sidebar from '@/components/common/Sidebar';
import { createChallengeVerification } from '@/api/verification';
import toast from 'react-hot-toast';
const VerificationSubmitForm = ({ challengeId }: { challengeId: string }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const challengeTitle = searchParams.get('title') || '챌린지 인증';
  useEffect(() => {
    setIsClient(true);
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  }

  const handleSubmit = async () => {
    if (!imageFile) {
      alert('인증 사진을 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);

    const data = {
      challengeId: Number(challengeId),
      imageFile: imageFile,
      content: description,
    };

    try {
      await createChallengeVerification(data);
      localStorage.setItem('verificationSuccess', '1');
      setTimeout(() => {
        router.push(`/challenge/${challengeId}?tab=photo`);
      }, 30);
    } catch (error) {
      toast.error('인증을 실패했습니다. 다시 시도해주세요.');
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
                <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </section>

        <section className="flex-grow flex flex-col">
          <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">인증내용(선택)</h2>
          <div className="relative flex-grow">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              placeholder="오늘의 챌린지는 어떠셨나요? 소감을 간단하게 작성해주세요!"
              className="w-full h-full p-3 border border-gray-200 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p className="absolute bottom-3 right-3 text-sm text-gray-400">{description.length}/300</p>
          </div>
        </section>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!imageFile || isSubmitting}
        className="w-full bg-[#F47150] text-white font-bold py-3 rounded-lg mt-6 hover:bg-[#d96443] transition-colors disabled:bg-[#F4715080]"
      >
        {isSubmitting ? '제출 중...' : '인증 완료하기'}
      </button>
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
                <Image src="/images/charactors/gamza.png" alt={challengeTitle} width={32} height={32} className="mr-3" />
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
              <Image src="/images/charactors/gamza.png" alt={challengeTitle} width={24} height={24} className="mr-2" />
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