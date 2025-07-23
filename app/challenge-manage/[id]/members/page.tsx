"use client";

import { useState } from "react";
import Image from "next/image";
import { UserGroupIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

const mockMembers = [
  {
    id: 1,
    nickname: "붕붕",
    location: "경기도 성남시 전체",
    profileImg: "/images/charactors/gamza.png",
  },
  {
    id: 2,
    nickname: "이상우강사님",
    location: "서울시 강남구 서초동",
    profileImg: "/images/charactors/gamza.png",
  },
  {
    id: 3,
    nickname: "애플버그",
    location: "경기도 성남시 수정구 단대동",
    profileImg: "/images/charactors/gamza.png",
  },
];

export default function ChallengeMemberManagePage() {
  const [tab, setTab] = useState<'member'|'banned'>("member");
  const [search, setSearch] = useState("");

  const filteredMembers = mockMembers.filter(m => m.nickname.includes(search));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex items-center p-4 border-b border-gray-200 bg-white dark:bg-gray-900">
        <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <UserGroupIcon className="w-6 h-6 text-pink-500" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">멤버 관리</h1>
      </header>

      {/* 탭 */}
      <div className="flex mt-2 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-center font-semibold ${tab==='member' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={()=>setTab('member')}
        >
          멤버 {mockMembers.length}
        </button>
        <button
          className={`flex-1 py-2 text-center font-semibold ${tab==='banned' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-400 dark:text-gray-500'}`}
          onClick={()=>setTab('banned')}
        >
          강퇴 0
        </button>
      </div>

      {/* 검색 */}
      <div className="px-4 mt-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* 멤버 리스트 */}
      <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
        {tab === 'member' && filteredMembers.length === 0 && (
          <div className="text-center text-gray-400 py-10">멤버가 없습니다.</div>
        )}
        {tab === 'member' && filteredMembers.map(member => (
          <div key={member.id} className="flex items-center px-4 py-3">
            <Image src={member.profileImg} alt={member.nickname} width={40} height={40} className="rounded-full border" />
            <div className="ml-3 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">{member.nickname}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{member.location}</div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        ))}
        {tab === 'banned' && (
          <div className="text-center text-gray-400 py-10">강퇴된 멤버가 없습니다.</div>
        )}
      </div>
    </div>
  );
} 