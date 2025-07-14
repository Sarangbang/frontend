'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquarePlus } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '@/components/common/Sidebar';
import ChatList from './ChatList';
import Tabs, { type Tab } from '../common/Tabs';
import ContentHeader from '../common/ContentHeader';

const groupChats = [
  {
    id: 1,
    type: 'group' as const,
    tags: ['챌린지'],
    name: '책...읽읍시다',
    participantCount: 8,
    lastMessage: '책은 어떻게 읽나요?',
    timestamp: '오후 9:00',
    unreadCount: 20,
    avatar: '/images/charactors/default_study.png',
  },
  {
    id: 2,
    type: 'group' as const,
    tags: ['동네모임'],
    name: '6시기상챌린지',
    participantCount: 20,
    lastMessage: '아 지금 일어났다',
    timestamp: '오후 3:00',
    unreadCount: 100,
    avatar: '/images/charactors/default_wakeup.png',
  },
  {
    id: 3,
    type: 'group' as const,
    tags: ['챌린지'],
    name: '모각코',
    participantCount: 5,
    lastMessage: 'int가 뭐죠',
    timestamp: '6월 21일',
    unreadCount: 101,
    avatar: '/images/charactors/default_wakeup.png',
  },
];

const oneOnOneChats = [
  {
    id: 1,
    type: 'dm' as const,
    name: '감자민영',
    lastMessage: '집에 가고 싶다',
    timestamp: '오후 6:09',
    unreadCount: 1,
    avatar: '/images/charactors/default_wakeup.png',
  },
  {
    id: 2,
    type: 'dm' as const,
    name: '신현성',
    lastMessage: '잠온다',
    timestamp: '오후 6:06',
    unreadCount: 2,
    avatar: '/images/charactors/default_wakeup.png',
  },
  {
    id: 3,
    type: 'dm' as const,
    name: '김영준',
    lastMessage: '운동 가야징',
    timestamp: '오후 3:21',
    unreadCount: 4,
    avatar: '/images/charactors/default_wakeup.png',
  },
];

const CHAT_TABS: Tab<'group' | 'dm'>[] = [
  { id: 'group', label: '그룹 채팅' },
  { id: 'dm', label: '1:1 채팅' },
];

export type Chat = (typeof groupChats)[number] | (typeof oneOnOneChats)[number];

export default function ChatClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'group' | 'dm'>('group');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chats = activeTab === 'group' ? groupChats : oneOnOneChats;
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chatInterface = (
    <div className="flex-1 flex flex-col bg-white dark:bg-black h-screen">
      <ContentHeader
        title="Challenge"
        isDesktop={isDesktop}
        isClient={isClient}
      >
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <MessageSquarePlus className="w-6 h-6 dark:text-white" />
        </button>
      </ContentHeader>
      <Tabs
        tabs={CHAT_TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="채팅방을 입력해주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto relative">
        <div
          className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-30 dark:opacity-10"
          style={{
            backgroundImage: "url('/images/chat-background.png')",
          }}
        />
        <div className="relative z-10">
          {filteredChats.length > 0 ? (
            <ChatList chats={filteredChats} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p>
                {activeTab === 'group'
                  ? '참여중인 그룹 채팅방이 없습니다.'
                  : '1:1 채팅 내역이 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isClient && isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <main className="w-2/4 mx-auto">{chatInterface}</main>
          </div>
        </div>
      ) : (
        chatInterface
      )}
    </div>
  );
} 