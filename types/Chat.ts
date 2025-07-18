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