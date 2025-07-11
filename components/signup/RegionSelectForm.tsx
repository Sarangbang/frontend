'use client';

import { useEffect, useState } from 'react';
import { getSidoRegions, getSubRegions } from '@/api/region';
import { Region } from '@/types/Region';

interface RegionSelectFormProps {
  onRegionSelect: (regionId: number | null, fullAddress: string, sidoId?: number | null, sigunguId?: number | null, dongId?: number | null) => void;
  initialRegionId?: number | null;
  initialFullAddress?: string;
  selectedSidoId?: number | null;
  selectedSigunguId?: number | null;
  selectedDongId?: number | null;
}

const RegionSelectForm = ({
  onRegionSelect,
  initialRegionId,
  initialFullAddress,
  selectedSidoId,
  selectedSigunguId,
  selectedDongId,
}: RegionSelectFormProps) => {
  // 데이터 목록 상태
  const [sidoList, setSidoList] = useState<Region[]>([]);
  const [sigunguList, setSigunguList] = useState<Region[]>([]);
  const [dongList, setDongList] = useState<Region[]>([]);

  // 사용자 선택 상태
  const [selectedSido, setSelectedSido] = useState<Region | null>(null);
  const [selectedSigungu, setSelectedSigungu] = useState<Region | null>(null);
  const [selectedDong, setSelectedDong] = useState<Region | null>(null);

  // '전체' 선택 상태
  const [allSelected, setAllSelected] = useState<'sigungu' | 'dong' | null>(
    null,
  );

  // 기타 UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 단계: 0=시도, 1=시군구, 2=동면읍
  const step = selectedSido ? (selectedSigungu ? 2 : 1) : 0;

  // 최초 마운트 시 시/도 목록 조회
  useEffect(() => {
    const fetchSidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSidoRegions();
        setSidoList(data);
      } catch (err) {
        setError('지역 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      }
      setLoading(false);
    };
    fetchSidos();
  }, []);

  // selectedSidoId, selectedSigunguId, selectedDongId가 바뀌면 선택 상태 동기화
  useEffect(() => {
    if (selectedSidoId && sidoList.length > 0) {
      const sido = sidoList.find(s => s.regionId === selectedSidoId) || null;
      setSelectedSido(sido);
      if (sido) {
        getSubRegions(sido.regionId).then(data => setSigunguList(data));
      }
    }
  }, [selectedSidoId, sidoList]);
  useEffect(() => {
    if (selectedSigunguId && sigunguList.length > 0) {
      const sigungu = sigunguList.find(sg => sg.regionId === selectedSigunguId) || null;
      setSelectedSigungu(sigungu);
      if (sigungu) {
        getSubRegions(sigungu.regionId).then(data => setDongList(data));
      }
    }
  }, [selectedSigunguId, sigunguList]);
  useEffect(() => {
    if (selectedDongId && dongList.length > 0) {
      const dong = dongList.find(d => d.regionId === selectedDongId) || null;
      setSelectedDong(dong);
    }
  }, [selectedDongId, dongList]);

  // 시/도 선택 시 하위 시/군/구 목록 조회
  const handleSidoSelect = async (sido: Region) => {
    setLoading(true);
    setError(null);
    setSelectedSido(sido);
    setSelectedSigungu(null);
    setSelectedDong(null);
    setAllSelected(null);
    onRegionSelect(null, '', sido.regionId, null, null);
    try {
      const data = await getSubRegions(sido.regionId);
      setSigunguList(data);
    } catch (err) {
      setError('하위 지역 정보를 불러오는 데 실패했습니다.');
      console.error(err);
    }
    setLoading(false);
  };

  // 시/군/구 선택 시 하위 동/면/읍 목록 조회
  const handleSigunguSelect = async (sigungu: Region) => {
    setLoading(true);
    setError(null);
    setSelectedSigungu(sigungu);
    setSelectedDong(null);
    setAllSelected(null);
    onRegionSelect(null, '', selectedSido?.regionId, sigungu.regionId, null);
    try {
      const data = await getSubRegions(sigungu.regionId);
      setDongList(data);
    } catch (err) {
      setError('하위 지역 정보를 불러오는 데 실패했습니다.');
      console.error(err);
    }
    setLoading(false);
  };

  // 동/면/읍 선택
  const handleDongSelect = (dong: Region) => {
    setSelectedDong(dong);
    setAllSelected(null);
    onRegionSelect(dong.regionId, dong.fullAddress, selectedSido?.regionId, selectedSigungu?.regionId, dong.regionId);
  };

  // '전체' 버튼 선택
  const handleAllSelect = () => {
    if (step === 1 && selectedSido) {
      setAllSelected('sigungu');
      setSelectedSigungu(null);
      setSelectedDong(null);
      onRegionSelect(selectedSido.regionId, selectedSido.fullAddress, selectedSido.regionId, null, null);
    } else if (step === 2 && selectedSigungu) {
      setAllSelected('dong');
      setSelectedDong(null);
      onRegionSelect(selectedSigungu.regionId, selectedSigungu.fullAddress, selectedSido?.regionId, selectedSigungu.regionId, null);
    }
  };

  // 상단 경로 클릭 핸들러
  const handlePathClick = (targetStep: 0 | 1) => {
    if (targetStep === 0) {
      // 시/도 선택으로 복귀
      setSelectedSido(null);
      setSelectedSigungu(null);
      setSelectedDong(null);
    } else if (targetStep === 1) {
      // 시/군/구 선택으로 복귀
      setSelectedSigungu(null);
      setSelectedDong(null);
    }
    setAllSelected(null);
    onRegionSelect(null, '', null, null, null);
  };

  // 초기화 버튼
  const handleReset = () => {
    handlePathClick(0);
  };

  // 상단 경로 UI
  const regionPathJSX = (
    <>
      {selectedSido ? (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => handlePathClick(0)}
        >
          {selectedSido.regionName}
        </span>
      ) : (
        '활동지역 선택'
      )}
      {selectedSigungu && (
        <>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => handlePathClick(1)}
          >
            {selectedSigungu.regionName}
          </span>
        </>
      )}
      {selectedDong && (
        <>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span>{selectedDong.regionName}</span>
        </>
      )}
      {allSelected && (
        <>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span>전체</span>
        </>
      )}
    </>
  );

  // 그리드에 표시할 항목
  let gridItems: Region[] = [];
  if (step === 0) gridItems = sidoList;
  else if (step === 1) gridItems = sigunguList;
  else if (step === 2) gridItems = dongList;

  const renderGridItem = (
    item: Region,
    isSelected: boolean,
    handler: () => void,
  ) => (
    <button
      key={item.regionId}
      onClick={handler}
      className={`border rounded-md py-3 font-semibold text-base transition-colors
        ${
          isSelected
            ? 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/50 dark:border-orange-500/80 dark:text-orange-400'
            : 'border-gray-200 text-gray-700 bg-white hover:border-orange-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-orange-500'
        }`}
    >
      {item.regionName}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>로딩 중...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex items-center justify-center mb-4 bg-gray-100 rounded-lg px-4 min-h-[56px] py-4 text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
        <div className="flex-1 flex justify-center text-center font-bold text-orange-700 dark:text-orange-400">
          {regionPathJSX}
        </div>
        {step > 0 && (
          <button
            className="absolute right-4 text-sm text-orange-500"
            onClick={handleReset}
          >
            초기화
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {step > 0 &&
          renderGridItem(
            {
              regionId: -1,
              regionName: '전체',
              regionType: 'SIDO',
              fullAddress: '',
            },
            (allSelected === 'sigungu' && step === 1) ||
              (allSelected === 'dong' && step === 2),
            handleAllSelect,
          )}

        {gridItems.map(item => {
          let isSelected = false;
          let handler = () => {};

          if (step === 0) {
            isSelected = selectedSido?.regionId === item.regionId;
            handler = () => handleSidoSelect(item);
          } else if (step === 1) {
            isSelected = selectedSigungu?.regionId === item.regionId;
            handler = () => handleSigunguSelect(item);
          } else if (step === 2) {
            isSelected = selectedDong?.regionId === item.regionId;
            handler = () => handleDongSelect(item);
          }
          return renderGridItem(item, isSelected, handler);
        })}
      </div>
    </>
  );
};

export default RegionSelectForm; 