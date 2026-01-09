self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-suggestions') {
    const currentDate = new Date();
    if (currentDate.getHours() === 9) {
        // Получить предложения
        let data = { title: 'Проверьте предложения', body: 'Могут быть обновления', url: '/' };

        const options = {
            body: data.body,
            data: {
                url: data.url || '/' // кастомные данные (например, ссылка для перехода)
            }
        };
        event.waitUntil(self.registration.showNotification(data.title, options));
    }
  }
});



// Обработка клика по уведомлению
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // закрываем уведомление

  event.waitUntil(
    clients.openWindow(event.notification.data.url) // открываем ссылку
  );
});
