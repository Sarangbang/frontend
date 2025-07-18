"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Ban,
  MoreVertical,
  Send,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { ChatSocket } from "@/util/chatSocket";
import { ChatMessage } from "@/types/Chat";
import Modal from "../common/Modal";

interface ChatRoomProps {
  onBack: () => void;
  username: string;
  roomId: string;
}

const PROFILE_IMG = "/images/charactors/gamza.png";
const NICKNAME = "감자민영";

function formatTime(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hour}:${m.toString().padStart(2, "0")}`;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function ChatRoom({ onBack, username, roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<(ChatMessage & { timestamp: Date })[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatSocketRef = useRef<ChatSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSocketOpen = () => {
      console.log("Socket is open, sending ENTER message.");
      chatSocketRef.current?.send({
        type: "ENTER",
        roomId: roomId,
        sender: username,
        message: `${username}님이 입장했습니다.`,
      });
    };

    const chatSocket = new ChatSocket(
      roomId,
      (msg) => {
        setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
      },
      handleSocketOpen
    );
    chatSocketRef.current = chatSocket;

    return () => {
      chatSocketRef.current?.send({
        type: "LEAVE",
        roomId: roomId,
        sender: username,
        message: `${username}님이 퇴장했습니다.`,
      });
      chatSocketRef.current?.close();
    };
  }, [username, roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const today = formatDate(new Date());

  const handleSend = () => {
    if (input.trim() && chatSocketRef.current) {
      chatSocketRef.current.send({
        type: "TALK",
        roomId: roomId,
        sender: username,
        message: input,
      });
      setInput("");
    }
  };

  const renderSystemMessage = (message: string, key: number) => (
    <div key={key} className="flex justify-center my-2">
      <span className="bg-gray-100 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-300 px-4 py-2 rounded-xl shadow-sm">
        {message}
      </span>
    </div>
  );

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-gray-800">
      {/* 상단바 */}
      <div className="h-16 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
        <button
          onClick={onBack}
          className="text-2xl font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Image
            src={PROFILE_IMG}
            alt="상대방 프로필 이미지"
            width={36}
            height={36}
            className="rounded-full border"
          />
          <span className="font-bold text-base text-gray-800 dark:text-white">
            {NICKNAME}
          </span>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          <MoreVertical size={24} />
        </button>
      </div>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-16 right-4 bg-rose-50 dark:bg-rose-900/20 p-4 shadow-lg rounded-lg z-30 w-56">
            <ul className="flex flex-col gap-3">
              <li>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <ShieldAlert size={16} /> 신고하기
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Ban size={16} /> 차단하기
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-lg font-semibold text-red-500 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-500/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={16} /> 채팅방 나가기
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
      {/* 메시지 영역 */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 relative"
        ref={scrollRef}
      >
        {/* 배경 감자 박스 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Image
            src="/images/chat-background.png"
            alt="채팅 배경"
            width={200}
            height={200}
          />
        </div>
        {/* 날짜 구분선 */}
        <div className="flex justify-center my-4">
          <span className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-300 px-4 py-1 rounded-full shadow-sm">
            {today}
          </span>
        </div>
        {/* 메시지 리스트 */}
        <div className="flex flex-col gap-3 relative z-10">
          {messages.map((msg, idx) => {
            if (msg.type === "ENTER" || msg.type === "LEAVE") {
              return renderSystemMessage(msg.message, idx);
            }

            const isMine = msg.sender === username;
            const time = formatTime(new Date(msg.timestamp));
            return (
              <div
                key={idx}
                className={`flex gap-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && (
                  <Image
                    src={PROFILE_IMG}
                    alt="상대방 프로필 이미지"
                    width={32}
                    height={32}
                    className="rounded-full border self-start"
                  />
                )}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {!isMine && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1 ml-1">
                      {msg.sender}
                    </span>
                  )}
                  <div className="flex items-end gap-2">
                    {isMine && (
                      <span className="text-[11px] text-gray-400 mb-1">
                        {time}
                      </span>
                    )}
                    <div
                      className={`rounded-xl px-4 py-2 text-sm shadow-sm break-all ${
                        isMine
                          ? "bg-[#FDEBE6] text-red-900"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white"
                      }`}
                    >
                      {msg.message}
                    </div>
                    {!isMine && (
                      <span className="text-[11px] text-gray-400 mb-1">
                        {time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 입력창 */}
      <div className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-10">
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 0 1 19.5 7.5l-8.625 8.625a1.125 1.125 0 0 1-1.591-1.591L18.25 3.5l-8.625 8.625a1.125 1.125 0 0 1-1.591-1.591L16.5 2.25a2.25 2.25 0 0 1 3.182 3.182l-10.94 10.94a4.5 4.5 0 0 1-6.364-6.364l7.693-7.693a.75.75 0 0 1 1.06 1.06Z"
            />
          </svg>
        </button>
        <input
          className="flex-1 border-none rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지 입력"
        />
        <button
          className="p-2 text-yellow-500 hover:text-yellow-600 disabled:text-gray-300 dark:disabled:text-gray-500"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={24} />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="알림"
      >
        <p>개발중입니다.</p>
      </Modal>
    </div>
  );
} 