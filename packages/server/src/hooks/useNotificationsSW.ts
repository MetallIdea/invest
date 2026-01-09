import { useEffect } from "react";

export function useNotificationsSW() {
  // Регистрация воркера и подписка
  async function subscribeUser() {
    const existRegistration = await navigator.serviceWorker.getRegistration(
      "/sw.js"
    );

    if (existRegistration) {
      return;
    }
    await navigator.serviceWorker.register("/sw.js");
    const registration = await navigator.serviceWorker.ready;
    // Проверяем поддержку API
    if ("periodicSync" in registration) {
      try {
        await (registration.periodicSync as any).register(
          "update-suggestions",
          {
            minInterval: 60 * 60 * 1000,
          }
        );
        console.log("Periodic Sync зарегистрирован");
      } catch (error) {
        console.error("Не удалось зарегистрировать:", error);
      }
    }

    // Запрашиваем разрешение на уведомления
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("OK");
    }
  }

  useEffect(() => {
    subscribeUser();
  });
}
