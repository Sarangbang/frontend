export type MessageType = "ENTER" | "LEAVE" | "TALK";

export interface Sender {
  userId: string;
  nickname: string;
  profileImageUrl: string;
}

export interface ChatMessage {
  type: MessageType;
  roomId: string;
  sender: Sender;
  message: string;
} 

export interface ChatRoomResponse {
  roomId: string;
  roomName: string;
  creatorId: string;
  participants: string[];
  createdAt: string;
  challengeImageUrl?: string;
}