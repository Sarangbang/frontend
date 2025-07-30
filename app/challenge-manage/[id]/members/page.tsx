"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UserGroupIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { getChallengeMembers } from "@/api/getChallengeMembers";
import { ChallengeMember } from "@/types/ChallengeMember";
import toast from "react-hot-toast";

export default function ChallengeMemberManagePage() {
  const params = useParams();
  const challengeId = Number(params.id);
  
  const [tab, setTab] = useState<'member'|'banned'>("member");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<ChallengeMember[]>([]);
  const [loading, setLoading] = useState(true);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadMembers = async () => {
      if (!challengeId) return;
      
      try {
        setLoading(true);
        const memberData = await getChallengeMembers(challengeId, today);
        setMembers(memberData);
      } catch (error) {
        toast.error('멤버 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [challengeId, today]);

  // 검색 필터링
  const filteredMembers = members.filter(member => 
    member.nickname.toLowerCase().includes(search.toLowerCase())
  );

  // 실제 멤버 수 (방장 제외한 일반 멤버)
  const memberCount = members.filter(m => m.role !== 'owner').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex items-center p-4 border-b border-gray-200 bg-white dark:bg-gray-900">
        <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <UserGroupIcon className="w-6 h-6 text-pink-500" />
        </button>
        <h1 className="text-lg font-medium text-gray-900 dark:text-white">멤버 관리</h1>
      </header>

      {/* 탭 */}
      <div className="flex mt-2 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-center font-semibold ${tab==='member' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={()=>setTab('member')}
        >
          멤버 {memberCount}
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
          <div className="text-center text-gray-400 py-10">
            {search ? '검색된 멤버가 없습니다.' : '멤버가 없습니다.'}
          </div>
        )}
        {tab === 'member' && filteredMembers.map(member => (
          <div key={member.id} className="flex items-center px-4 py-3">
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
              <Image 
                src={
                  member.profileImageUrl && 
                  member.profileImageUrl.trim() !== '' && 
                  member.profileImageUrl !== 'null' 
                    ? member.profileImageUrl 
                    : "/images/charactors/gamza.png"
                }
                alt={member.nickname} 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 이미지로 대체
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/charactors/gamza.png";
                }}
              />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">{member.nickname}</span>
                {member.role === 'owner' && (
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">방장</span>
                )}
              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                  {member.userRegion || '지역 정보 없음'}
                </div>
              <div className="text-xs text-gray-400 mt-1">
                오늘 인증: {member.status ? '✅ 완료' : '❌ 미완료'}
              </div>
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