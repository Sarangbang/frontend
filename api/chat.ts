import apiClient from './apiClient';
import { ChatRoomResponse } from '@/types/Chat';

// GET 요청으로 채팅방 목록을 받아오며, 각 방의 roomName을 제목으로 사용
export async function fetchChatRooms() {
  const response = await apiClient.get<ChatRoomResponse[]>('/chat/rooms');
  return response.data; // [{ roomName, ... }]
} 