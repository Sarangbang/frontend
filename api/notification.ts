import { getServerURL } from '@/lib/config';
import { ACCESS_TOKEN } from '@/constants/global';
import toast from 'react-hot-toast';
import apiClient from './apiClient';
import { Notification } from '@/types/Notification';

/**
 * 서버로부터 실시간 알림을 받기 위해 SSE(Server-Sent Events) 연결을 설정합니다.
 * @returns {EventSource | null} EventSource 인스턴스를 반환합니다. 토큰이 없거나 서버 사이드에서 호출될 경우 null을 반환합니다.
 */
export const subscribeToNotifications = (
  addNotification: (notification: Notification) => void
) => {
  // EventSource는 브라우저 환경에서만 사용 가능합니다.
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return null;
  }

  // 백엔드 SSE 구독 엔드포인트 URL을 구성합니다.
  const url = `${getServerURL()}/notifications/subscribe?token=${token}`;

  const eventSource = new EventSource(url);

  // 알림 이벤트 수신
  eventSource.addEventListener('notification', (event) => {
    try {
        const notification = JSON.parse(event.data);
        addNotification(notification);
        toast('새로운 알림이 도착했습니다!');
    } catch (error) {
        throw error;
    }
  });

  eventSource.onerror = (error) => {
    throw error;
  };

  return eventSource;
};

/**
 * 사용자의 모든 알림 목록을 조회합니다.
 * @returns {Promise<Notification[]>} 알림 목록을 반환합니다.
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }
    const response = await apiClient.get<Notification[]>(`/notifications?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 특정 알림을 읽음 상태로 처리합니다.
 * @param {string} notificationId 읽음 처리할 알림의 ID
 * @returns {Promise<Notification>} 업데이트된 알림 정보를 반환합니다.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await apiClient.patch<Notification>(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 사용자의 모든 알림을 삭제합니다.
 */
export const deleteAllNotifications = async (): Promise<void> => {
  try {
    await apiClient.delete('/notifications');
  } catch (error) {
    throw error;
  }
};