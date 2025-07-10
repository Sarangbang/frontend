'use client';

import { useState } from 'react';
import regionTree from '@/data/region_tree.json';
import { useRouter } from 'next/navigation';

// region_tree.json 타입 정의
interface Dong {
  name: string;
  code: string;
}
interface Sigungu {
  name: string;
  code: string;
  children: Dong[];
}
interface Sido {
  name: string;
  code: string;
  children: Sigungu[];
}

interface RegionSelectFormProps {
  onRegionSelect?: (regionLabel: string) => void;
  initialRegion?: string;
  showLogo?: boolean;
  showButton?: boolean;
}

const RegionSelectForm = ({ onRegionSelect, showLogo = true, showButton = true }: RegionSelectFormProps) => {
  const router = useRouter();
  const [selectedSido, setSelectedSido] = useState<Sido | null>(null);
  const [selectedSigungu, setSelectedSigungu] = useState<Sigungu | null>(null);
  const [selectedDong, setSelectedDong] = useState<Dong | null>(null);
  // '전체' 선택 상태
  const [allSelected, setAllSelected] = useState<{ step: number; label: string } | null>(null);

  // 지역 선택 시 콜백 호출
  const callRegionSelect = (label: string) => {
    if (onRegionSelect) onRegionSelect(label);
  };

  // 시/도 목록
  const sidoList: Sido[] = regionTree as Sido[];
  // 시/군/구 목록
  const sigunguList: Sigungu[] = selectedSido ? selectedSido.children : [];
  // 동/면/읍 목록
  const dongList: Dong[] = selectedSigungu ? selectedSigungu.children : [];

  // 현재 단계: 0=시도, 1=시군구, 2=동면읍
  const step = selectedSido
    ? selectedSigungu
      ? 2
      : 1
    : 0;

  // 상단 회색 바 클릭 핸들러들
  const handleSidoClick = () => {
    setSelectedSido(null);
    setSelectedSigungu(null);
    setSelectedDong(null);
  };
  const handleSigunguClick = () => {
    setSelectedSigungu(null);
    setSelectedDong(null);
  };
  const handleDongClick = () => {
    setSelectedDong(null);
  };
  // 초기화 버튼
  const handleReset = () => {
    setSelectedSido(null);
    setSelectedSigungu(null);
    setSelectedDong(null);
    setAllSelected(null);
  };
  // 상단 경로 JSX
  const regionPathJSX = (
    <>
      {allSelected && allSelected.step === 1 ? (
        <span className="text-black font-bold">{allSelected.label}</span>
      ) : (
        <>
          {selectedSido ? (
            <span
              className="text-black font-bold cursor-pointer hover:underline"
              onClick={handleSidoClick}
            >
              {selectedSido.name}
            </span>
          ) : (
            '활동지역 선택'
          )}
          {selectedSigungu && !allSelected ? (
            <>
              <span className="mx-2 text-gray-400">{'>'}</span>
              <span
                className="text-black font-bold cursor-pointer hover:underline"
                onClick={handleSigunguClick}
              >
                {selectedSigungu.name}
              </span>
            </>
          ) : null}
          {selectedDong && !allSelected ? (
            <>
              <span className="mx-2 text-gray-400">{'>'}</span>
              <span
                className="text-black font-bold cursor-pointer hover:underline"
                onClick={handleDongClick}
              >
                {selectedDong.name}
              </span>
            </>
          ) : null}
          {allSelected && allSelected.step === 2 && (
            <>
              <span className="mx-2 text-gray-400">{'>'}</span>
              <span className="text-black font-bold">{allSelected.label}</span>
            </>
          )}
        </>
      )}
    </>
  );

  // 그리드에 표시할 항목
  let gridItems: { name: string; code: string; isAll?: boolean }[] = [];
  if (step === 0) gridItems = sidoList;
  else if (step === 1) gridItems = [{ name: '전체', code: 'ALL', isAll: true }, ...sigunguList];
  else if (step === 2) gridItems = [{ name: '전체', code: 'ALL', isAll: true }, ...dongList];

  // 선택 핸들러
  const handleSelect = (item: { name: string; code: string; isAll?: boolean }) => {
    setAllSelected(null);
    if (step === 0) {
      const sido = sidoList.find(s => s.code === item.code) || null;
      setSelectedSido(sido);
      setSelectedSigungu(null);
      setSelectedDong(null);
    } else if (step === 1) {
      if (item.isAll) {
        setSelectedSigungu(null);
        setSelectedDong(null);
        setAllSelected({ step: 1, label: `${selectedSido?.name} 전체` });
        callRegionSelect(`${selectedSido?.name} 전체`);
      } else {
        const sigungu = sigunguList.find(sg => sg.code === item.code) || null;
        setSelectedSigungu(sigungu);
        setSelectedDong(null);
      }
    } else if (step === 2) {
      if (item.isAll) {
        setSelectedDong(null);
        setAllSelected({ step: 2, label: `${selectedSigungu?.name} 전체` });
        callRegionSelect(`${selectedSigungu?.name} 전체`);
      } else {
        const dong = dongList.find(d => d.code === item.code) || null;
        setSelectedDong(dong);
        if (dong && selectedSido && selectedSigungu) {
          callRegionSelect(`${selectedSido.name} > ${selectedSigungu.name} > ${dong.name}`);
        }
      }
    }
  };

  // 이전 단계로 돌아가기
  const handleBack = () => {
    if (step === 2) {
      setSelectedDong(null);
    } else if (step === 1) {
      setSelectedSigungu(null);
      setSelectedDong(null);
    } else if (step === 0) {
      setSelectedSido(null);
      setSelectedSigungu(null);
      setSelectedDong(null);
    }
  };

  // 회원가입 버튼 활성화 조건
  const isJoinEnabled =
    (step === 1 && allSelected?.step === 1) ||
    (step === 2 && allSelected?.step === 2) ||
    (!!selectedSido && !!selectedSigungu && !!selectedDong);

  return (
    <div className={showLogo
      ? 'flex flex-col justify-center min-h-screen bg-white sm:px-6 lg:px-8 dark:bg-gray-900 py-12'
      : 'bg-white sm:px-6 lg:px-8 dark:bg-gray-900 py-4'}>
      <div className={`sm:mx-auto sm:w-full sm:max-w-md${showLogo ? '' : ' mt-0'}`}>
        {showLogo && (
          <div className="flex flex-col items-center">
            <img src="/images/charactors/gamza.png" alt="일심동네 로고" width={80} height={80} />
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">일심동네</h2>
            <p className="mt-2 text-sm font-semibold text-orange-600">같은 동네, 같은 마음 함께 만드는 습관</p>
          </div>
        )}
      </div>
      <div className={`sm:mx-auto sm:w-full sm:max-w-md${showLogo ? ' mt-8' : ''}`}>
        <div className="px-4 py-2 bg-white sm:rounded-lg sm:px-10 dark:bg-gray-800">
          {/* 상단 회색 바 */}
          <div className="relative flex items-center justify-center mb-4 bg-gray-100 rounded-lg px-4 min-h-[56px] py-4 text-base font-medium text-gray-700">
            <div className="flex-1 flex justify-center">
              {regionPathJSX}
            </div>
            {(step > 0) && (
              <button className="absolute right-4 text-sm text-orange-500" onClick={handleReset}>
                초기화
              </button>
            )}
          </div>
          {/* 그리드 버튼 */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {gridItems.map(item => (
              <button
                key={item.code}
                className={`border rounded-md py-3 font-semibold text-base transition-colors
                  ${
                    (item.isAll && allSelected && allSelected.step === step) ||
                    (step === 0 && selectedSido?.code === item.code) ||
                    (step === 1 && selectedSigungu?.code === item.code && !allSelected) ||
                    (step === 2 && selectedDong?.code === item.code && !allSelected)
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-gray-200 text-gray-700 bg-white hover:border-orange-400'
                  }
                `}
                onClick={() => handleSelect(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
          {/* 회원가입 버튼 */}
          {showButton && (
            <button
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={!isJoinEnabled}
              onClick={() => router.push('/login')}
            >
              회원가입
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionSelectForm; 