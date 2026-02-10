import { useEffect } from "react";

type PeriodicSync = {
  register: (name: string, options: { minInterval: number }) => Promise<void>;
};

export function useNotificationsSW() {
  // Регистрация воркера и подписка
  async function subscribeUser() {
    const existRegistration =
      await navigator.serviceWorker.getRegistration("/public/sw.js");

    if (existRegistration) {
      return;
    }
    await navigator.serviceWorker.register("/public/sw.js");
    const registration = await navigator.serviceWorker.ready;
    // Проверяем поддержку API
    if ("periodicSync" in registration) {
      try {
        await (registration.periodicSync as PeriodicSync).register(
          "update-suggestions",
          {
            minInterval: 60 * 60 * 1000,
          },
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
