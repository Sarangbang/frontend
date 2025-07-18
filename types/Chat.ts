export type MessageType = "ENTER" | "LEAVE" | "TALK";

export interface ChatMessage {
  type: MessageType;
  roomId: string;
  sender: string;
  message: string;
} 