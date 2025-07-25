"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, CameraIcon } from "@heroicons/react/24/solid";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { getCategoryNames } from "@/api/category";
import { CategoryName } from "@/types/Category";
import { ChallengeFormData } from "@/types/Challenge";
import {
  formatDateToYYYYMMDD,
  calculateEndDateObject,
  formatRange,
} from "@/util/dateUtils";
import RegionSelectForm from '@/components/signup/RegionSelectForm';

interface CreateChallengeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isDesktop: boolean;
}

const CreateChallengeForm = ({
  onClose,
  onSubmit,
  isDesktop,
}: CreateChallengeFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ChallengeFormData>(
    {
      categoryId: 0,
      title: '',
      description: '',
      participants: '',
      verificationMethod: '',
      regionId: null as number | null,
      regionAddress: "",
      startDate: new Date(),
      endDate: new Date(),
      image: null,
      duration: '',
      imageFile: null,
    }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 지역 단계별 선택 regionId 상태
  const [selectedSidoId, setSelectedSidoId] = useState<number | null>(null);
  const [selectedSigunguId, setSelectedSigunguId] = useState<number | null>(null);
  const [selectedDongId, setSelectedDongId] = useState<number | null>(null);

  const [categories, setCategories] = useState<CategoryName[]>([]);

  // 지역 선택 완료 핸들러
  const [regionStepSelected, setRegionStepSelected] = useState(false);
  const handleRegionSelect = (
    regionId: number | null,
    fullAddress: string,
    sidoId?: number | null,
    sigunguId?: number | null,
    dongId?: number | null,
  ) => {
    setFormData(prev => ({
      ...prev,
      regionId: regionId,
      regionAddress: fullAddress,
    }));
    setSelectedSidoId(sidoId ?? null);
    setSelectedSigunguId(sigunguId ?? null);
    setSelectedDongId(dongId ?? null);
    setRegionStepSelected(!!regionId);
  };

  const handleNext = () => {
    switch (step) {
      case 1:
        if (!formData.categoryId) {
          alert("챌린지 주제를 선택해주세요.");
          return;
        }
        break;
      case 2:
        if (!formData.title || formData.title.trim().length < 2) {
          alert("챌린지 제목은 2자 이상이어야 합니다.");
          return;
        }
        break;
      case 3:
        if (!formData.participants || formData.participants < 2) {
          alert("참여 인원은 2명 이상이어야 합니다.");
          return;
        }
        if (formData.verificationMethod.trim().length < 10) {
          alert("인증 방법은 최소 10자 이상 입력해주세요.");
          return;
        }
        break;
      case 4:
        if (!formData.regionId) {
          alert("챌린지 참여 지역을 선택해주세요.");
          return;
        }
        break;
      case 5:
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (formData.startDate < today) {
          alert("챌린지 시작일은 오늘이후여야 합니다.");
          return;
        }

        if (!formData.duration) {
          alert("챌린지 기간을 선택해주세요.");
          return;
        }
        if (isNaN(formData.endDate.getTime())) {
          alert("종료일이 올바르지 않습니다.");
          return;
        }
        if (formData.duration === "직접입력" && !formData.endDate) {
          alert("종료일을 선택해주세요.");
          return;
        }
        if (formData.endDate < formData.startDate) {
          alert('종료일은 시작일 이후여야 합니다.');
          return;
        }
        break;
      default:
        break;
    }
    setStep((prev) => prev + 1);
  };
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // 'name'이 "category"나 "participants"일 경우,
    // 해당 필드를 숫자로 변환하여 상태를 업데이트합니다.
    if (name === "participants") {
        setFormData((prev) => ({
          ...prev,
          participants: value === '' ? '' : Number(value)
        }));
    } else if (name === "categoryId") {
        setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (name === "duration") {
      setFormData((prev) => ({
        ...prev,
        duration: value,
        endDate:
          value === "직접입력"
            ? prev.startDate
            : calculateEndDateObject(prev.startDate, value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: null, imageFile: file }));
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoryNames();

        // '전체' 카테고리 제거 후 정렬
        const filtered = data
          .filter((c) => c.categoryName !== "전체")
          .sort((a, b) => a.categoryId - b.categoryId);

        setCategories(filtered);
      } catch (error) {
      }
    };

    loadCategories();
  }, []);

  const durations = ["1주", "2주", "3주", "한 달"];

  const renderStepContent = () => {
    const calculatedEndDate =
    formData.duration === "직접입력"
      ? formData.endDate
      : calculateEndDateObject(formData.startDate, formData.duration);

    switch (step) {
      case 1: // 챌린지 주제
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              챌린지 주제를 선택해주세요.
            </h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category.categoryId}
                  className="flex items-center space-x-3 text-lg dark:text-gray-300"
                >
                  <input
                    type="radio"
                    name="categoryId"
                    value={category.categoryId}
                    checked={formData.categoryId === category.categoryId}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: category.categoryId,
                        categoryName: category.categoryName,
                      }))
                    }
                    className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>{category.categoryName}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 2: // 챌린지 제목, 소개글
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">
              챌린지 제목을 입력해주세요.
            </h2>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
              타인에게 불쾌감을 주는 단어를 사용할 경우 챌린지가 삭제될 수
              있습니다.
            </p>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={50}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span className="absolute right-3 bottom-3 text-sm text-gray-400 dark:text-gray-500">
                {formData.title.length}/50
              </span>
            </div>
          </div>
        );
      case 3: // 참여 인원, 인증 방법
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              참여 인원을 입력해주세요.
            </h2>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
              최소 2명 이상의 인원을 입력해주세요.
            </p>
            <div className="relative flex items-center">
              <input
                type="number"
                name="participants"
                value={formData.participants ?? ''}
                min={2}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span className="absolute right-4 text-lg text-gray-500 pointer-events-none dark:text-gray-400">
                명
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">
              인증방법을 입력해주세요.
            </h2>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
              다른 참여자들이 실천 여부를 알 수 있도록 구체적으로 작성해주시면
              좋습니다.
            </p>
            <div className="relative">
              <textarea
                name="verificationMethod"
                value={formData.verificationMethod}
                onChange={handleChange}
                maxLength={500}
                className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span className="absolute right-3 bottom-3 text-sm text-gray-400 dark:text-gray-500">
                {formData.verificationMethod.length}/500
              </span>
            </div>
          </div>
        );
      case 4: // 챌린지 참여 지역
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              챌린지 참여 지역
            </h2>
            <RegionSelectForm
              onRegionSelect={handleRegionSelect}
              selectedSidoId={selectedSidoId}
              selectedSigunguId={selectedSigunguId}
              selectedDongId={selectedDongId}
            />
          </div>
        );
      case 5: // 챌린지 시작일, 기간
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">챌린지 시작일</h2>
            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={formData.startDate}
                onSelect={(date) =>
                  setFormData((f) => ({ ...f, startDate: date || new Date() }))
                }
                locale={ko}
              />
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">
              챌린지 기간
            </h2>
            <div className="space-y-3">
              {durations.map((duration) => (
                <label
                  key={duration}
                  className="flex items-center space-x-3 text-lg dark:text-gray-300"
                >
                  <input
                    type="radio"
                    name="duration"
                    value={duration}
                    checked={formData.duration === duration}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>{duration}</span>
                </label>
              ))}
              <label className="flex items-center space-x-3 text-lg dark:text-gray-300">
                <input
                  type="radio"
                  name="duration"
                  value="직접입력"
                  checked={formData.duration === "직접입력"}
                  onChange={handleChange}
                  className="w-5 h-5 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <span>직접입력</span>
              </label>
              {formData.duration === "직접입력" && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-2 dark:text-white">
                    종료일을 선택해주세요
                  </h2>
                  <input
                    type="date"
                    value={formatDateToYYYYMMDD(formData.endDate)}
                    min={formatDateToYYYYMMDD(formData.startDate)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: new Date(e.target.value),
                      }))
                    }
                    className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>
            {formData.startDate && calculatedEndDate &&
              formData.startDate < calculatedEndDate && (
                <div className="mt-8 text-center border border-gray-300 rounded-md p-4 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    최종 기간
                  </h2>
                  <p className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {formatRange(formData.startDate, calculatedEndDate)}
                  </p>
                </div>
              )}
          </div>
        );
      case 6: // 대표 이미지
        return (
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              챌린지 대표 이미지(선택)
            </h2>
            <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">
              챌린지를 대표하는 이미지를 첨부해주세요. 없으면 기본 이미지로
              생성됩니다.
            </p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center flex-col text-gray-400 mx-auto cursor-pointer relative overflow-hidden dark:bg-gray-700 dark:text-gray-500"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="챌린지 이미지 미리보기"
                  layout="fill"
                  objectFit="cover"
                />
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
      const selectedCategory = categories.find(
        (c) => c.categoryId === formData.categoryId
      );
      const categoryName = selectedCategory?.categoryName ?? "";
        return (
          <div>
            <div className="space-y-7 text-lg dark:text-white">
              <div>
                <p className="font-medium">챌린지 주제</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                  {categoryName}
                </p>
              </div>
              <div>
                <p className="font-medium">챌린지 제목</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                  {formData.title}
                </p>
              </div>
              <div>
                <p className="font-medium">참여인원</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                  {formData.participants}명
                </p>
              </div>
              <div>
                <p className="font-medium">인증방법</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5 whitespace-pre-wrap">
                  {formData.verificationMethod}
                </p>
              </div>
              <div>
                <p className="font-medium">챌린지 참여 지역</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                  {formData.regionAddress}
                </p>
              </div>
              <div>
                <p className="font-medium">챌린지 시작일</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                  {formData.startDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <div>
                  <p className="font-bold">챌린지 기간</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                    {formatRange(formData.startDate, calculatedEndDate)}
                  </p>
                </div>
              </div>
              {imagePreview && (
                <div>
                  <p className="font-bold">대표 이미지</p>
                  <div className="mt-2 relative w-32 h-32">
                    <Image
                      src={imagePreview}
                      alt="챌린지 이미지 미리보기"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
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

      <main className="flex-1 p-6 overflow-y-auto">{renderStepContent()}</main>

      <footer className="p-4">
        {step < totalSteps ? (
          <button
            onClick={handleNext}
            className="w-full bg-[#F4724F] text-white py-3 rounded-lg text-lg font-semibold"
          >
            다음 ({step}/{totalSteps - 1})
          </button>
        ) : (
          <button
            onClick={() => {
              // ✅ categoryId와 기본 이미지 URL 매핑
              const categoryImageMap: Record<number, string> = {
                2: "/images/charactors/default_wakeup.png",
                3: "/images/charactors/default_study.png",
                4: "/images/charactors/default_health.png",
                5: "/images/charactors/default_life.png",
                6: "/images/charactors/default_mind.png",
                7: "/images/charactors/default_hobby.png",
                8: "/images/charactors/default_communication.png",
                9: "/images/charactors/default_money.png",
                10: "/images/charactors/default_general.png",
              };

              // 이미지 미지정 시, 카테고리에 맞는 기본 이미지로 설정
              const defaultImageUrl = categoryImageMap[formData.categoryId!];
              
              const payload = {
                ...formData,
                image: formData.imageFile ? null : defaultImageUrl,
                imageFile: formData.imageFile,
                participants: formData.participants === '' ? 0 : formData.participants,
              };

              // 최종 제출
              onSubmit(payload);
            }}
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
