'use client';

import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/lib/store/notificationStore';
import {
  getNotifications,
  markNotificationAsRead,
  deleteAllNotifications,
} from '@/lib/api/notification';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useUserStore } from '@/lib/store/userStore';
import { Bell } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '../common/Sidebar';

const NotificationClient = () => {
  const { isLoggedIn } = useUserStore();
  const {
    notifications,
    setNotifications,
    readNotification,
    clearAllNotifications,
  } = useNotificationStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchNotifications = async () => {
        try {
          const fetchedNotifications = await getNotifications();
          setNotifications(fetchedNotifications);
        } catch (error) {
            throw error;
        }
      };
      fetchNotifications();
    }
  }, [isLoggedIn, setNotifications]);

  const handleNotificationClick = async (notificationId: string, url: string) => {
    try {
      await markNotificationAsRead(notificationId);
      readNotification(notificationId);
      router.push(url);
    } catch (error) {
      throw error;
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await deleteAllNotifications();
      clearAllNotifications();
    } catch (error) {
        throw error;
    }
  };

  if (!isLoggedIn) {
    // Or show a message prompting to log in
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-semibold mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-600 dark:text-gray-400">알림을 보려면 로그인해주세요.</p>
      </div>
    );
  }

  const notificationContent = (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium dark:text-white flex items-center">
          <Bell className="w-8 h-8 mr-3 text-gray-900 dark:text-white" />
          Notification
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAllNotifications}
            className="py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            모두 삭제
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.url)}
                className={`p-4 cursor-pointer transition-colors ${
                  notification.read
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-md text-gray-800 dark:text-gray-200">{notification.content}</p>
                  {!notification.read && (
                     <span className="flex-shrink-0 ml-4 h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden="true" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center justify-center">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg">새로운 알림이 없습니다.</p>
                <p className="text-sm">활동이 있을 때 알림을 받게 됩니다.</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {isClient && isDesktop ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:ml-64">
            <div className="max-w-4xl mx-auto py-8">
              {notificationContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 flex flex-col">
          {notificationContent}
        </div>
      )}
    </div>
  );
};

export default NotificationClient; 