import { create } from 'zustand';
import { Notification } from '@/types/Notification';

interface NotificationState {
  eventSource: EventSource | null;
  notifications: Notification[];
  setEventSource: (eventSource: EventSource | null) => void;
  closeEventSource: () => void;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  readNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  eventSource: null,
  notifications: [],
  setEventSource: (eventSource) => set({ eventSource }),
  closeEventSource: () =>
    set((state) => {
      if (state.eventSource) {
        state.eventSource.close();
        console.log('SSE connection closed');
      }
      return { eventSource: null };
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  setNotifications: (notifications) => set({ notifications }),
  readNotification: (notificationId: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    })),
  clearAllNotifications: () => set({ notifications: [] }),
})); 