import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage, MessagePayload } from 'firebase/messaging';
import { saveFCMToken } from '@/api/notification';
import { ACCESS_TOKEN } from '@/constants/global';
import toast from 'react-hot-toast';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * FCM 토큰을 요청하고 백엔드에 등록합니다.
 * @param {boolean} registerToServer 백엔드에 토큰 등록 여부 (기본값: true)
 * @returns {Promise<string | null>} FCM 토큰
 */
export const requestForToken = async (registerToServer: boolean = true): Promise<string | null> => {
  try {
    if (await isSupported()) {
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });
        
        if (token) {
          // 백엔드에 토큰 등록 (로그인한 사용자만)
          if (registerToServer && typeof window !== 'undefined') {
            const accessToken = localStorage.getItem(ACCESS_TOKEN);
            if (accessToken) {
              try {
                await saveFCMToken(token);
              } catch (error) {
                // 토큰 등록 실패는 사용자에게 알리지 않음 (백그라운드 처리)
              }
            }
          }
          
          return token;
        }
      } else {
        toast.error('알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요.');
      }
    }
  } catch (err) {
    // 토큰 요청 실패는 조용히 처리
  }
  return null;
};

/**
 * 포그라운드 메시지 처리를 설정합니다.
 */
export const setupForegroundMessaging = async () => {
  try {
    if (await isSupported()) {
      const messaging = getMessaging(app);
      
      // 포그라운드에서 메시지 수신 처리
      onMessage(messaging, (payload: MessagePayload) => {
        // 알림 표시
        if (payload.notification) {
          const { title, body } = payload.notification;
          toast(body || '새로운 알림이 도착했습니다!', {
            duration: 4000,
            icon: '🔔',
          });
          
          // 브라우저 알림도 표시 (권한이 있는 경우)
          if (Notification.permission === 'granted') {
            new Notification(title || '새 알림', {
              body: body || '새로운 알림이 도착했습니다!',
              icon: '/images/favicon_io/android-chrome-192x192.png',
              tag: 'sarangbang-notification',
            });
          }
        }
      });
    }
  } catch (error) {
    // 포그라운드 메시지 설정 실패는 조용히 처리
  }
};

/**
 * FCM 토큰 갱신을 처리합니다.
 */
export const handleTokenRefresh = async () => {
  try {
    if (await isSupported()) {
      const messaging = getMessaging(app);
      
      // 토큰 갱신 감지 및 처리
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      
      if (currentToken && typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
          try {
            await saveFCMToken(currentToken);
          } catch (error) {
            // 토큰 갱신 등록 실패는 조용히 처리
          }
        }
      }
    }
  } catch (error) {
    // 토큰 갱신 처리 실패는 조용히 처리
  }
};

/**
 * FCM 초기화 및 설정을 수행합니다.
 */
export const initializeFCM = async () => {
  // FCM 토큰 요청 및 등록
  await requestForToken();
  
  // 포그라운드 메시지 처리 설정
  await setupForegroundMessaging();
  
  // 토큰 갱신 처리 (주기적으로 확인)
  setInterval(handleTokenRefresh, 60000 * 60); // 1시간마다 확인
}; 