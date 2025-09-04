'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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

interface NotificationBellProps {
  position?: 'header' | 'sidebar';
}

const NotificationBell = ({ position = 'sidebar' }: NotificationBellProps) => {
  const { isLoggedIn } = useUserStore();
  const {
    notifications,
    setNotifications,
    readNotification,
    clearAllNotifications,
  } = useNotificationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notificationId: string, url: string) => {
    try {
      await markNotificationAsRead(notificationId);
      readNotification(notificationId);
      router.push(url);
      setIsDropdownOpen(false);
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
    return null;
  }
  
  const dropdownPositionClasses =
    position === 'header'
      ? 'absolute right-0 top-full mt-2' // For mobile header
      : 'absolute bottom-0 left-full ml-2'; // For desktop sidebar


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
      >
        <Bell className="h-6 w-6 text-gray-900 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>
      {isDropdownOpen && (
        <div
          className={`${dropdownPositionClasses} w-80 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600 z-50`}
        >
          <div className="p-3">
            <h3 className="text-lg font-semibold dark:text-white">알림</h3>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification.id, notification.url)
                  }
                  className={`p-3 border-t dark:border-gray-600 cursor-pointer ${
                    notification.read
                      ? 'bg-white dark:bg-gray-700'
                      : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                  }`}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500 dark:text-gray-400">
                알림이 없습니다.
              </li>
            )}
          </ul>
          {notifications.length > 0 && (
            <div className="p-1 border-t dark:border-gray-600">
              <button
                onClick={handleClearAllNotifications}
                className="w-full py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                모두 삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 