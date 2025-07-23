import apiClient from './apiClient';
import { ChatRoomResponse, ChatMessage } from '@/types/Chat';

// GET 요청으로 채팅방 목록을 받아오며, 각 방의 roomName을 제목으로 사용
export async function fetchChatRooms() {
  const response = await apiClient.get<ChatRoomResponse[]>('/chat/rooms');
  return response.data; // [{ roomName, ... }]
}

// 채팅방 메시지 조회
export interface MessageHistoryResponseDto {
  messages: ChatMessage[];
  hasNext: boolean;
}

export async function fetchChatMessages(roomId: string, page?: number): Promise<MessageHistoryResponseDto> {
  const params = new URLSearchParams();
  if (page !== undefined) {
    params.append("page", page.toString());
  }
  const response = await apiClient.get<MessageHistoryResponseDto>(`/chat/rooms/${roomId}/messages`, { params });
  return response.data;
} 