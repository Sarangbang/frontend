export type MessageType = "ENTER" | "LEAVE" | "TALK";

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
}

export interface ChatRoomResponse {
  roomId: string;
  roomName: string;
  creatorId: string;
  participants: string[];
  createdAt: string;
  challengeImageUrl?: string;
  unreadCount: number;
}

// 채팅방 메시지 조회
export interface fetchChatHistory {
  messages: ChatMessage[];
  hasNext: boolean;
}