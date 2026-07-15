"use client";
// عون — تفعيل التذكيرات اللطيفة (Web Push).
import { useEffect, useState } from "react";
import { pushStatus, enablePush, disablePush, type PushStatus } from "@/lib/push-client";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/store/toast";

/** رسائل فشل التفعيل — سببٌ واضح بدل صمتٍ محيّر. */
const ENABLE_ERRORS: Record<string, string> = {
  denied: "رفضتَ الإذن — فعّله من إعدادات المتصفح",
  "no-key": "التذكيرات غير مهيأة على الخادم",
  error: "تعذّر التفعيل",
};

export default function NotificationsToggle() {
  const [status, setStatus] = useState<PushStatus>("unsupported");
  const [isIos, setIsIos] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast((s) => s.show);

  useEffect(() => {
    // قراءة قدرة المتصفح تتم بعد التركيب فقط (لا تتوفّر في الخادم).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(pushStatus());
    // آيفون/آيباد: سفاري لا يدعم Web Push إلا بعد التثبيت على الشاشة الرئيسية.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  if (status === "unsupported") {
    // على iOS نُرشد بهدوء بدل الاختفاء الصامت؛ وسوى ذلك لا نعرض شيئاً.
    if (!isIos) return null;
    return (
      <div className="card mt-4 flex items-center gap-3 p-4">
        <span
          className="icon-chip h-11 w-11 shrink-0 text-[--color-amber-ink]"
          style={{ background: "var(--color-amber-soft)" }}
        >
          <Icon name="bell" size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[--color-ink]">تذكيراتٌ لطيفة</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[--color-muted]">
            على الآيفون: ثبّت عون أولاً — شارِك ثم أضِف إلى الشاشة الرئيسية، وستجد التذكيرات هنا
          </p>
        </div>
      </div>
    );
  }

  const enable = async () => {
    setBusy(true);
    const result = await enablePush();
    if (result === "ok") {
      setStatus("granted");
    } else {
      setStatus(pushStatus());
      toast(ENABLE_ERRORS[result], { kind: "error" });
    }
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
    const res = await fetch("/api/push/test", { method: "POST" });
    setBusy(false);
    toast(res.ok ? "أرسلنا إشعاراً تجريبياً" : "تعذّر الإرسال", {
      kind: res.ok ? "success" : "error",
    });
  };

  return (
    <div className="card mt-4 flex items-center gap-3 p-4">
      <span
        className="icon-chip h-11 w-11 shrink-0 text-[--color-amber-ink]"
        style={{ background: "var(--color-amber-soft)" }}
      >
        <Icon name="bell" size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-[--color-ink]">تذكيراتٌ لطيفة</h3>
        <p className="mt-0.5 text-xs text-[--color-muted]">
          {status === "granted"
            ? "مُفعّلة — سنذكّرك قبل موعد كل عادة بلطف."
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
            className="press pill bg-[--color-surface-2] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-3] disabled:opacity-50"
          >
            جرّب
          </button>
          <button
            type="button"
            onClick={turnOff}
            disabled={busy}
            aria-label="إيقاف التذكيرات"
            className="press pill px-3 py-2 text-sm text-[--color-faint] transition-colors hover:text-[--color-danger-ink]"
          >
            إيقاف
          </button>
        </div>
      ) : status === "default" ? (
        <button
          type="button"
          onClick={enable}
          disabled={busy}
          className="press pill shrink-0 bg-[--color-ink] px-5 py-2 text-sm font-semibold text-[--color-cream] shadow-[var(--shadow-2)] disabled:opacity-50"
        >
          {busy ? (
            <span className="inline-flex items-center justify-center">
              <Spinner size={16} />
            </span>
          ) : (
            "تفعيل"
          )}
        </button>
      ) : null}
    </div>
  );
}
