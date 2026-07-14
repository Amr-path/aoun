/* eslint-disable */
// عون — عامل الخدمة: عملٌ دون اتصال (تخزين مؤقّت) + إشعارات Web Push.

const CACHE = "aoun-v2";
const PRECACHE = ["/", "/offline", "/manifest.webmanifest", "/icons/icon-192.png"];

// يُخزَّن فقط ما هو استجابةٌ ناجحة أساسية (نفس الأصل) — لا صفحات 500/الأخطاء.
function isCacheable(res) {
  return res && res.ok && res.status === 200 && res.type === "basic";
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// مسح الكاش عند الخروج (خصوصية الأجهزة المشتركة) — يُستدعى من زرّ الخروج.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "clear-cache") {
    event.waitUntil(caches.delete(CACHE));
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // التنقّل بين الصفحات: الشبكة فقط، ثم صفحة عدم الاتصال عند الفشل.
  // لا نُخزّن استجابات التنقّل: قد تحوي HTML مصادَقاً (اللوحة باسم المستخدم)
  // يبقى في Cache Storage بعد الخروج على جهازٍ مشترك.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((r) => r || caches.match("/offline"))
      )
    );
    return;
  }

  // الأصول الثابتة: المخزّن أولاً.
  const isAsset =
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(png|jpg|jpeg|svg|webmanifest|css|js|woff2?)$/.test(url.pathname);
  if (isAsset) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            if (isCacheable(res)) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
  }
});

// ─── إشعارات Web Push ──────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "عون";
  const options = {
    body: data.body || "",
    tag: data.tag,
    dir: "rtl",
    lang: "ar",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    data: { url: data.url || "/dashboard" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url.includes(target) && "focus" in w) return w.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
