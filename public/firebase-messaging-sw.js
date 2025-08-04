// Firebase 메시징 Service Worker
// 백그라운드에서 FCM 메시지를 처리합니다.

// Firebase SDK import (CDN 방식)
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase 설정 (환경변수는 Service Worker에서 접근할 수 없으므로 직접 설정)
// 실제 사용 시에는 환경에 맞는 설정값으로 변경해야 합니다.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // 실제 값으로 변경 필요
  authDomain: "YOUR_AUTH_DOMAIN", // 실제 값으로 변경 필요
  projectId: "YOUR_PROJECT_ID", // 실제 값으로 변경 필요
  storageBucket: "YOUR_STORAGE_BUCKET", // 실제 값으로 변경 필요
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // 실제 값으로 변경 필요
  appId: "YOUR_APP_ID" // 실제 값으로 변경 필요
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.notification?.title || '새 알림';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 알림이 도착했습니다!',
    icon: '/images/favicon_io/android-chrome-192x192.png',
    badge: '/images/favicon_io/favicon-16x16.png',
    tag: 'sarangbang-notification',
    data: {
      url: payload.data?.url || '/', // 클릭 시 이동할 URL
      ...payload.data
    },
    actions: [
      {
        action: 'open',
        title: '확인',
        icon: '/images/favicon_io/favicon-16x16.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ],
    requireInteraction: true, // 사용자가 상호작용할 때까지 알림 유지
    silent: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') {
    // 닫기 액션
    return;
  }

  // 알림 클릭 시 해당 페이지로 이동
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // 이미 열린 탭이 있는지 확인
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // 이미 열린 탭이 있으면 포커스하고 해당 URL로 이동
          return client.focus().then(() => {
            return client.navigate(urlToOpen);
          });
        }
      }
      // 열린 탭이 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 알림 닫기 이벤트 처리
self.addEventListener('notificationclose', function(event) {
  // 알림 닫기 이벤트 (필요시 추가 로직 구현)
}); 