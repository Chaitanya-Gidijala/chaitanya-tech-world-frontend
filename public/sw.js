/* Chaitanya Tech World — service worker for daily-puzzle push notifications. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Chaitanya Tech World', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Traceflow Daily';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'A new puzzle is waiting for you.',
      icon: '/icon-512.png',
      badge: '/favicon.svg',
      tag: data.tag || 'ctw-daily',
      data: { url: data.url || '/daily' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/daily';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const w of windows) {
        if ('focus' in w && new URL(w.url).origin === self.location.origin) {
          w.navigate(url);
          return w.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
