"use client";
// عون — تفعيل التذكيرات اللطيفة (Web Push).
import { useEffect, useState } from "react";
import { pushStatus, enablePush, disablePush, type PushStatus } from "@/lib/push-client";

export default function NotificationsToggle() {
  const [status, setStatus] = useState<PushStatus>("unsupported");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // قراءة قدرة المتصفح تتم بعد التركيب فقط (لا تتوفّر في الخادم).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(pushStatus());
  }, []);

  if (status === "unsupported") return null;

  const enable = async () => {
    setBusy(true);
    const ok = await enablePush();
    setStatus(ok ? "granted" : pushStatus());
    setBusy(false);
  };

  const turnOff = async () => {
    setBusy(true);
    await disablePush();
    setStatus("default");
    setBusy(false);
  };

  const test = async () => {
    setBusy(true);
    await fetch("/api/push/test", { method: "POST" });
    setBusy(false);
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="card mt-4 flex items-center gap-3 p-4">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl"
        style={{ background: "var(--color-amber-soft)" }}
      >
        🔔
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-[--color-ink]">تذكيراتٌ لطيفة</h3>
        <p className="mt-0.5 text-xs text-[--color-muted]">
          {status === "granted"
            ? sent
              ? "أرسلنا إشعاراً تجريبياً ✓"
              : "مُفعّلة — سنذكّرك قبل موعد كل عادة بلطف."
            : status === "denied"
              ? "الإشعارات محظورة من المتصفح — فعّلها من إعداداته."
              : "فعّلها لتصلك تذكيراتٌ قبل موعد كل عادة."}
        </p>
      </div>

      {status === "granted" ? (
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={test}
            disabled={busy}
            className="pill bg-[--color-surface-2] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-3] disabled:opacity-50"
          >
            جرّب
          </button>
          <button
            type="button"
            onClick={turnOff}
            disabled={busy}
            aria-label="إيقاف التذكيرات"
            className="pill px-3 py-2 text-sm text-[--color-faint] transition-colors hover:text-[--color-clay-ink]"
          >
            إيقاف
          </button>
        </div>
      ) : status === "default" ? (
        <button
          type="button"
          onClick={enable}
          disabled={busy}
          className="pill shrink-0 px-5 py-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
          style={{ background: "var(--color-sage)" }}
        >
          {busy ? "…" : "تفعيل"}
        </button>
      ) : null}
    </div>
  );
}
