"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface ChallengeEditFormProps {
  challengeId: string | string[] | undefined;
}

export default function ChallengeEditForm({ challengeId }: ChallengeEditFormProps) {
  // 임시 상태 (실제 데이터 연동 시 API 호출 필요)
  const [image, setImage] = useState("/images/charactors/default_communication.png");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [verification, setVerification] = useState("");
  const [participants, setParticipants] = useState(5);
  const [endDate, setEndDate] = useState("2025-07-24");
  const [period, setPeriod] = useState("3주");
  const [customPeriod, setCustomPeriod] = useState("");

  // 헤더, 푸터 포함한 통일된 레이아웃
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col min-h-[80vh]">
      {/* 헤더 */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button type="button">
          <ChevronLeftIcon className="w-6 h-6 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold dark:text-white">챌린지 정보 수정</h1>
        <span className="w-6 h-6" />
      </header>

      {/* 메인 폼 */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* 대표사진 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">대표사진</label>
          <div className="flex items-center space-x-4">
            <Image src={image} alt="대표사진" width={56} height={56} className="rounded-full border" />
            {/* 실제 구현 시 파일 업로드 처리 필요 */}
            <button type="button" className="text-xs text-gray-500 border px-2 py-1 rounded">이미지 변경</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">전체 챌린지 목록에서 보이는 이미지예요</p>
        </div>

        {/* 챌린지 제목 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">챌린지 제목</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="챌..읽읍시다"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* 챌린지 소개글 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">챌린지 소개글</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="우리 챌린지는요... 책을 읽어요..."
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* 인증방법 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">인증방법</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="책을 읽고 있는 사진을 올리세요!!"
            rows={2}
            value={verification}
            onChange={e => setVerification(e.target.value)}
          />
        </div>

        {/* 참여 인원 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">참여 인원</label>
          <div className="flex items-center">
            <input
              type="number"
              min={1}
              className="w-24 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={participants}
              onChange={e => setParticipants(Number(e.target.value))}
            />
            <span className="ml-2 text-sm text-gray-500">명</span>
          </div>
        </div>

        {/* 챌린지 종료일 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">챌린지 종료일</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="w-full bg-[#F4724F] hover:bg-[#e56b49] text-white font-semibold py-3 rounded-lg text-lg transition"
        >
          저장하기
        </button>
      </footer>
    </div>
  );
} 