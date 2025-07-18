"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChatSocket } from "@/util/chatSocket";
import { ChatMessage } from "@/types/Chat";

interface ChatRoomProps {
  onBack: () => void;
  username: string;
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

export default function ChatRoom({ onBack, username }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showDate, setShowDate] = useState(true);
  const chatSocketRef = useRef<ChatSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatSocket = new ChatSocket((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    chatSocketRef.current = chatSocket;

    // 입장 메시지
    chatSocket.send({
      type: "ENTER",
      roomId: "1",
      sender: username,
      message: "",
    });

    return () => {
      chatSocket.send({
        type: "LEAVE",
        roomId: "1",
        sender: username,
        message: "",
      });
      chatSocket.close();
    };
  }, [username]);

  useEffect(() => {
    // 새 메시지 오면 스크롤 하단으로
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 예시: 날짜 구분선은 첫 메시지에만 표시
  const today = formatDate(new Date());

  const handleSend = () => {
    if (input.trim() && chatSocketRef.current) {
      chatSocketRef.current.send({
        type: "TALK",
        roomId: "1",
        sender: username,
        message: input,
      });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fffaf7] relative">
      {/* 상단바 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white z-10">
        <button onClick={onBack} className="text-2xl font-bold text-[#ffb300] mr-2">←</button>
        <div className="flex items-center gap-2">
          <Image src={PROFILE_IMG} alt="감자" width={36} height={36} className="rounded-full border" />
          <span className="font-bold text-base text-[#222]">{NICKNAME}</span>
        </div>
        <button className="text-2xl text-gray-400 ml-2">⋮</button>
      </div>
      {/* 상단 메뉴 */}
      <div className="flex flex-col gap-2 px-6 py-4 bg-[#fff0e0] border-b">
        <button className="w-full py-2 rounded text-[#ffb300] font-semibold bg-white border border-[#ffe0b2]">⛔ 신고하기</button>
        <button className="w-full py-2 rounded text-[#ffb300] font-semibold bg-white border border-[#ffe0b2]">🚫 차단하기</button>
        <button className="w-full py-2 rounded text-[#ff4d4f] font-semibold bg-[#fff0e0] border border-[#ffb3b3]">🗑 채팅방 나가기</button>
      </div>
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2 relative" ref={scrollRef}>
        {/* 배경 감자 박스 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
          <Image src="/images/chat-background.png" alt="감자박스" width={180} height={180} />
        </div>
        {/* 날짜 구분선 */}
        <div className="flex justify-center my-4">
          <span className="bg-[#fff0e0] text-xs text-gray-500 px-4 py-1 rounded-full border border-[#ffe0b2] shadow-sm">
            {today}
          </span>
        </div>
        {/* 메시지 리스트 */}
        <div className="flex flex-col gap-2 relative z-10">
          {messages.map((msg, idx) => {
            const isMine = msg.sender !== NICKNAME;
            // 시간 표시 예시: 실제로는 msg에 timestamp가 있으면 그걸 사용
            const time = formatTime(new Date());
            return (
              <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <Image src={PROFILE_IMG} alt="감자" width={32} height={32} className="rounded-full border mr-2" />
                )}
                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && <span className="text-xs text-[#ffb300] font-semibold mb-1 ml-1">{NICKNAME}</span>}
                  <div className={`rounded-2xl px-4 py-2 text-sm shadow ${isMine ? "bg-[#fff0e0] text-[#ffb300] font-bold" : "bg-white text-[#222]"}`}>
                    {msg.message}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1">{time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 입력창 */}
      <div className="flex items-center px-4 py-3 border-t bg-white z-10">
        <input
          className="flex-1 border border-[#ffe0b2] rounded-full px-4 py-2 mr-2 bg-[#fffaf7] focus:outline-none focus:ring-2 focus:ring-[#ffb300]"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="메시지 입력"
        />
        <button
          className="bg-[#ffb300] text-white font-bold px-5 py-2 rounded-full shadow"
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
} 