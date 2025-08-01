export type MessageType = "ENTER" | "LEAVE" | "TALK" | "RE_ENTER" | "UNREAD_MESSAGE";

export interface Sender {
  userId: string;
  nickname: string;
  profileImageUrl: string;
}

export interface ChatMessage {
  _id: string;
  type: MessageType;
  roomId: string;
  sender: Sender;
  message: string;
  createdAt: string;
  unreadCount: number;
}

export interface ChatRoomResponse {
  roomId: string;
  roomName: string;
  creatorId: string;
  participants: string[];
  createdAt: string;
  challengeImageUrl?: string;
  unreadCount: number;
  lastChatMessage: string;
  lastMessageCreatedAt: string;
}

// 채팅방 메시지 조회
export interface fetchChatHistory {
  messages: ChatMessage[];
  hasNext: boolean;
}

export interface ChatNotification {
  type: MessageType;
  roomId: string;
  message: string; // 새로 온 메시지 내용
  createdAt: string; // 메시지 생성 시간
}