/**
 * Notification API 래퍼.
 * 브라우저 알림 권한을 요청하고, 타이머 종료 시 알림을 띄운다.
 */

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
}

/** 사용자 제스처 내에서 호출 권장. 거부해도 앱 동작에는 영향 없음. */
export async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "default") {
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }
  return Notification.permission;
}

export function notify(title, body) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      silent: true, // 별도 알림음을 Web Audio로 재생하므로 시스템음은 끔
    });
  } catch {
    /* 일부 브라우저는 Service Worker 등록이 필요할 수 있음 — 무시 */
  }
}
