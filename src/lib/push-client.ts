// عون — مساعدات Web Push على العميل (تسجيل عامل الخدمة والاشتراك).

export type PushStatus = "unsupported" | "default" | "granted" | "denied";

/** يحوّل مفتاح VAPID (base64url) إلى Uint8Array المطلوب للاشتراك. */
export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/** حالة دعم/إذن الإشعارات الحالية. */
export function pushStatus(): PushStatus {
  if (typeof window === "undefined") return "unsupported";
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return "unsupported";
  }
  return Notification.permission as PushStatus;
}

/** نتيجة محاولة التفعيل — أسبابٌ مميّزة لنُخبر المستخدم بصدق ماذا حدث. */
export type EnablePushResult = "ok" | "denied" | "no-key" | "error";

/** يسجّل عامل الخدمة، يطلب الإذن، ويشترك في Web Push. */
export async function enablePush(): Promise<EnablePushResult> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "error";
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) return "no-key";

  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "denied";

    const existing = await reg.pushManager.getSubscription();
    const sub =
      existing ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      }));

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

/** يلغي الاشتراك على هذا الجهاز. */
export async function disablePush(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  });
  await sub.unsubscribe();
}
