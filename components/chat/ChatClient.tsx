'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MessageSquarePlus } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '@/components/common/Sidebar';
import ChatList from './ChatList';
import Tabs, { type Tab } from '../common/Tabs';
import ContentHeader from '../common/ContentHeader';
import ChatRoom from './ChatRoom';
import { Sender, ChatRoomResponse, ChatMessage } from '@/types/Chat';
import { fetchChatRooms, markAsRead, fetchChatMessages } from '@/api/chat';
import { useUserStore } from '@/lib/store/userStore';
import { ChatSocket } from '@/util/chatSocket';

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

export default function ChatClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'group' | 'dm'>('group');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [inRoom, setInRoom] = useState<ChatRoomResponse | null>(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const user = useUserStore((state) => state.user);

  // --- ChatRoom state management ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const chatSocketRef = useRef<ChatSocket | null>(null);
  // --- End of ChatRoom state management ---

  // userStore에서 Sender 변환
  const mySender: Sender = user
    ? {
        userId: user.uuid,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl ?? '',
      }
    : {
        userId: '',
        nickname: '',
        profileImageUrl: '',
      };
  const [chatRooms, setChatRooms] = useState<ChatRoomResponse[]>([]);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res: ChatRoomResponse[] = await fetchChatRooms();
        setChatRooms(res);
      } catch (e) {
        setChatRooms([]);
      }
    }
    loadRooms();
    setIsClient(true);
  }, []);

  // --- WebSocket and message handling logic ---
  useEffect(() => {
    if (!inRoom) return;

    let isMounted = true;
    const initialLoad = async () => {
      try {
        setPage(0);
        setHasNextPage(true);
        const res = await fetchChatMessages(inRoom.roomId, 0);
        if (!isMounted) return;
        setMessages(
          res.messages
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
        setHasNextPage(res.hasNext);
        setPage(0);
      } catch (error) {
        console.error("Failed to fetch initial messages:", error);
      }
    };
    initialLoad();

    const handleSocketMessage = (data: any) => {
      const serverMessage = data as ChatMessage;
      if (serverMessage.type === 'TALK') {
        setMessages((prevMessages) => {

          // 내가 보낸 낙관적 메시지에 대한 서버의 응답인지 확인
          if (serverMessage.sender.userId === mySender.userId) {
            const optimisticMessageIndex = prevMessages.findLastIndex(
              (msg) =>
                msg.sender.userId === serverMessage.sender.userId &&
                !msg._id.match(/^[a-f\d]{24}$/i) && // 임시 ID를 가진 메시지 필터링 (정규식: 24자리 hex)
                msg.message === serverMessage.message
            );

            if (optimisticMessageIndex !== -1) {
              const newMessages = [...prevMessages];
              const optimisticUnreadCount = newMessages[optimisticMessageIndex].unreadCount;
              // 임시 메시지를 서버 응답으로 교체하되, unreadCount는 유지
              newMessages[optimisticMessageIndex] = { ...serverMessage, unreadCount: optimisticUnreadCount };
              return newMessages;
            }
          }
          // 다른 사람 메시지거나, 내 메시지에 대한 응답을 못 찾은 경우
          return [...prevMessages, serverMessage];
        });
      } else if (data.type === 'MESSAGE_READ_UPDATE') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId
              ? { ...msg, unreadCount: data.unreadCount }
              : msg
          )
        );
      }
    };

    const chatSocket = new ChatSocket(inRoom.roomId, handleSocketMessage);
    chatSocketRef.current = chatSocket;

    return () => {
      isMounted = false;
      console.log(`[CLEANUP] Closing socket for room ${inRoom.roomId}`);
      chatSocket.close();
    };
  }, [inRoom, mySender.userId]);

  const loadMoreMessages = async () => {
    if (!inRoom || !hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetchChatMessages(inRoom.roomId, nextPage);
      if (res.messages.length > 0) {
        const sortedNewMessages = res.messages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const uniqueNewMessages = sortedNewMessages.filter(
            (m) => !existingIds.has(m._id)
          );

          if (uniqueNewMessages.length === 0) {
            setHasNextPage(false);
            return prev;
          }

          return [...uniqueNewMessages, ...prev];
        });
        setPage(nextPage);
      }
      setHasNextPage(res.hasNext);
    } catch (error) {
      console.error("Failed to fetch more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = (message: string) => {
    if (inRoom && chatSocketRef.current && mySender.userId) {
      const tempId = `${new Date().toISOString()}-${mySender.userId}-${Math.random()}`;
      const initialUnreadCount = inRoom.participants ? inRoom.participants.length - 1 : 0;
      
      const optimisticMessage: ChatMessage = {
        _id: tempId, // 임시 ID
        type: "TALK",
        roomId: inRoom.roomId,
        sender: mySender,
        message: message,
        createdAt: new Date().toISOString(),
        unreadCount: initialUnreadCount > 0 ? initialUnreadCount : 0,
      };

      // 낙관적 업데이트: UI에 바로 메시지 추가
      setMessages(prev => [...prev, optimisticMessage]);

      // 서버에 메시지 전송
      chatSocketRef.current.send(optimisticMessage);
    }
  };
  // --- End of WebSocket and message handling logic ---


  const chats = activeTab === 'group' ? chatRooms : [];
  const filteredChats = chats.filter((chat) =>
    chat.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnterRoom = (chat: ChatRoomResponse) => {
    if (chat.unreadCount > 0) {
      markAsRead(chat.roomId);
      setChatRooms(prevRooms =>
        prevRooms.map(r =>
          r.roomId === chat.roomId ? { ...r, unreadCount: 0 } : r
        )
      );
    }
    setInRoom(chat);
  };

  const handleBackToList = () => {
    setInRoom(null);
    setMessages([]);
    setPage(0);
    setHasNextPage(true);
    setIsLoadingMore(false);
    if (chatSocketRef.current) {
      chatSocketRef.current.close();
      chatSocketRef.current = null;
    }
  };

  const chatInterface = (
    <div className="flex-1 flex flex-col bg-white dark:bg-black h-screen">
      {inRoom ? (
        <ChatRoom
          onBack={handleBackToList}
          sender={mySender}
          roomId={inRoom.roomId}
          roomName={inRoom.roomName}
          challengeImageUrl={inRoom.challengeImageUrl}
          messages={messages}
          onSend={handleSend}
          loadMoreMessages={loadMoreMessages}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
        />
      ) : (
        <>
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
              {filteredChats.length > 0 && (
                  <ChatList chats={filteredChats} onChatClick={handleEnterRoom} />
              )}
            </div>
          </div>
        </>
      )}
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