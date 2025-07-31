// 이 파일은 의도적으로 비워 둡니다.
// Firebase SDK가 이 파일을 감지하고 백그라운드 메시지 처리를 자동으로 처리합니다.
// 커스텀 로직이 필요한 경우 여기에 추가할 수 있습니다.
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  const data = event.data.json();
  const title = data.notification.title;
  const options = {
    body: data.notification.body,
    icon: '/images/favicon_io/favicon-16x16.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
}); 