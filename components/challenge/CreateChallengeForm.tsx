'use client';

import { useState, useRef } from 'react';
import { ChevronLeftIcon, CameraIcon } from '@heroicons/react/24/solid';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import Image from 'next/image';

interface CreateChallengeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isDesktop: boolean;
}

const CreateChallengeForm = ({ onClose, onSubmit, isDesktop }: CreateChallengeFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    participants: '',
    verificationMethod: '',
    verificationFrequency: '',
    verificationCountPerDay: '',
    startDate: new Date(),
    duration: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    switch (step) {
      case 1:
        if (!formData.category) {
          alert('챌린지 주제를 선택해주세요.');
          return;
        }
        break;
      case 2:
        if (!formData.title) {
          alert('챌린지 제목을 입력해주세요.');
          return;
        }
        break;
      case 3:
        if (!formData.participants) {
          alert('참여 인원을 입력해주세요.');
          return;
        }
        if (!formData.verificationMethod) {
          alert('인증방법을 입력해주세요.');
          return;
        }
        break;
      case 4:
        if (!formData.verificationFrequency) {
          alert('인증빈도를 선택해주세요.');
          return;
        }
        if (!formData.verificationCountPerDay) {
          alert('하루 인증 횟수를 입력해주세요.');
          return;
        }
        break;
      case 5:
        if (!formData.duration) {
          alert('챌린지 기간을 선택해주세요.');
          return;
        }
        break;
      default:
        break;
    }
    setStep((prev) => prev + 1);
  };
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const categories = ['운동/건강', '기상/루틴', '학습/독서', '생활/정리', '마음/감정', '취미/자기계발', '관계/소통', '재테크/자산', '그 외'];
  const frequencies = ['매일', '주 1회', '주 2회', '주 3회', '주 4회', '주 5회', '주 6회'];
  const durations = ['1주', '2주', '3주', '한달'];

  const renderStepContent = () => {
    switch (step) {
      case 1: // 챌린지 주제
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">챌린지 주제를 선택해주세요.</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-3 text-lg dark:text-gray-300">
                  <input type="radio" name="category" value={category} checked={formData.category === category} onChange={handleChange} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 2: // 챌린지 제목, 소개글
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">챌린지 제목을 입력해주세요.</h2>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">타인에게 불쾌감을 주는 단어를 사용할 경우 챌린지가 삭제될 수 있습니다.</p>
            <div className="relative">
              <input type="text" name="title" value={formData.title} onChange={handleChange} maxLength={50} className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <span className="absolute right-3 bottom-3 text-sm text-gray-400 dark:text-gray-500">{formData.title.length}/50</span>
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">챌린지 소개글(선택)</h2>
            <div className="relative">
              <textarea name="description" value={formData.description} onChange={handleChange} maxLength={500} className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <span className="absolute right-3 bottom-3 text-sm text-gray-400 dark:text-gray-500">{formData.description.length}/500</span>
            </div>
          </div>
        );
      case 3: // 참여 인원, 인증 방법
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">참여 인원을 입력해주세요.</h2>
            <div className="relative flex items-center">
              <input type="number" name="participants" value={formData.participants} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <span className="absolute right-4 text-lg text-gray-500 pointer-events-none dark:text-gray-400">명</span>
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">인증방법을 입력해주세요.</h2>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">다른 참여자들이 실천 여부를 알 수 있도록 구체적으로 작성해주시면 좋습니다.</p>
            <div className="relative">
              <textarea name="verificationMethod" value={formData.verificationMethod} onChange={handleChange} maxLength={500} className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <span className="absolute right-3 bottom-3 text-sm text-gray-400 dark:text-gray-500">{formData.verificationMethod.length}/500</span>
            </div>
          </div>
        );
      case 4: // 인증 빈도, 하루 인증 횟수
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">인증빈도</h2>
            <div className="space-y-3">
              {frequencies.map((freq) => (
                <label key={freq} className="flex items-center space-x-3 text-lg dark:text-gray-300">
                  <input type="radio" name="verificationFrequency" value={freq} checked={formData.verificationFrequency === freq} onChange={handleChange} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                  <span>{freq}</span>
                </label>
              ))}
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">하루 인증 횟수</h2>
            <div className="relative flex items-center">
              <input type="number" name="verificationCountPerDay" value={formData.verificationCountPerDay} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <span className="absolute right-4 text-lg text-gray-500 pointer-events-none dark:text-gray-400">회</span>
            </div>
          </div>
        );
      case 5: // 챌린지 시작일, 기간
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">챌린지 시작일</h2>
            <div className="flex justify-center">
               <DayPicker mode="single" selected={formData.startDate} onSelect={(date) => setFormData(f => ({...f, startDate: date || new Date()}))} locale={ko} />
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">챌린지 기간</h2>
            <div className="space-y-3">
              {durations.map((duration) => (
                <label key={duration} className="flex items-center space-x-3 text-lg dark:text-gray-300">
                  <input type="radio" name="duration" value={duration} checked={formData.duration === duration} onChange={handleChange} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                  <span>{duration}</span>
                </label>
              ))}
              <label className="flex items-center space-x-3 text-lg dark:text-gray-300">
                <input type="radio" name="duration" value="직접입력" checked={formData.duration === "직접입력"} onChange={handleChange} className="w-5 h-5 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                <span>직접입력</span>
              </label>
            </div>
          </div>
        );
      case 6: // 대표 이미지
        return (
          <div>
            <h2 className="text-2xl font-bold dark:text-white">챌린지 대표 이미지(선택)</h2>
            <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">챌린지를 대표하는 이미지를 첨부해주세요. 없으면 기본 이미지로 생성됩니다.</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <div 
                className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center flex-col text-gray-400 mx-auto cursor-pointer relative overflow-hidden dark:bg-gray-700 dark:text-gray-500"
                onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="챌린지 이미지 미리보기" layout="fill" objectFit="cover" />
              ) : (
                <>
                  <CameraIcon className="w-16 h-16" />
                  <span>사진 추가</span>
                </>
              )}
            </div>
          </div>
        );
      case 7: // 요약
        return (
          <div>
            <div className="space-y-7 text-lg dark:text-white">
              <div>
                <p className="font-bold">챌린지 주제</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.category}</p>
              </div>
              <div>
                <p className="font-bold">챌린지 제목</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.title}</p>
              </div>
              {formData.description && (
                <div>
                  <p className="font-bold">소개글</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1.5 whitespace-pre-wrap">{formData.description}</p>
                </div>
              )}
              <div>
                <p className="font-bold">참여인원</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.participants}명</p>
              </div>
              <div>
                <p className="font-bold">인증방법</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5 whitespace-pre-wrap">{formData.verificationMethod}</p>
              </div>
              <div>
                <p className="font-bold">인증빈도</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.verificationFrequency}</p>
              </div>
              <div>
                <p className="font-bold">하루 인증 횟수</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.verificationCountPerDay}회</p>
              </div>
              <div>
                <p className="font-bold">챌린지 시작일</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.startDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-bold">챌린지 기간</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">{formData.duration}</p>
              </div>
              {imagePreview && (
                <div>
                  <p className="font-bold">대표 이미지</p>
                  <div className="mt-2 relative w-32 h-32">
                    <Image src={imagePreview} alt="챌린지 이미지 미리보기" layout="fill" objectFit="cover" className="rounded-md" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalSteps = 7;
  
  const formContent = (
    <>
       <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button onClick={step === 1 ? onClose : handlePrev}>
          <ChevronLeftIcon className="w-6 h-6 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold dark:text-white">챌린지 등록</h1>
        <button onClick={onClose}>
          <span className="text-lg dark:text-white">취소</span>
        </button>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        {renderStepContent()}
      </main>

      <footer className="p-4">
        {step < totalSteps ? (
          <button
            onClick={handleNext}
            className="w-full bg-[#F4724F] text-white py-3 rounded-lg text-lg font-semibold"
          >
            다음 ({step}/{totalSteps -1})
          </button>
        ) : (
          <button
            onClick={() => onSubmit(formData)}
            className="w-full bg-[#F4724F] text-white py-3 rounded-lg text-lg font-semibold"
          >
            챌린지 생성
          </button>
        )}
      </footer>
    </>
  );

  if (isDesktop) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
               {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-800 z-50 flex flex-col">
      {formContent}
    </div>
  );
};

export default CreateChallengeForm; 