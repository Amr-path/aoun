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

// مفتاح iOS: مسارٌ 51×31 وإبهامٌ أبيض 27 بحركةٍ قصيرة.
function Switch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative block h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-[--color-accent]" : "bg-[--color-surface-3]"
      }`}
    >
      <span
        className={`absolute top-[2px] block h-[27px] w-[27px] rounded-full bg-white shadow-[var(--shadow-1)] transition-all duration-200 ${
          on ? "start-[22px]" : "start-[2px]"
        }`}
      />
    </span>
  );
}

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
      <div className="card mt-3 flex items-center gap-3 p-4">
        <span
          className="icon-chip h-8 w-8 shrink-0 rounded-[8px] text-[--color-amber-ink]"
          style={{ background: "var(--color-amber-soft)" }}
        >
          <Icon name="bell" size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[--color-ink]">تذكيراتٌ لطيفة</h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-[--color-muted]">
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

  const granted = status === "granted";

  return (
    <div className="card mt-3 flex items-center gap-3 p-4">
      <span
        className="icon-chip h-8 w-8 shrink-0 rounded-[8px] text-[--color-amber-ink]"
        style={{ background: "var(--color-amber-soft)" }}
      >
        <Icon name="bell" size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-[--color-ink]">تذكيراتٌ لطيفة</h3>
        <p className="mt-0.5 text-[13px] text-[--color-muted]">
          {granted
            ? "مُفعّلة — سنذكّرك قبل موعد كل عادة بلطف."
            : status === "denied"
              ? "الإشعارات محظورة من المتصفح — فعّلها من إعداداته."
              : "فعّلها لتصلك تذكيراتٌ قبل موعد كل عادة."}
        </p>
        {granted && (
          <button
            type="button"
            onClick={test}
            disabled={busy}
            className="mt-1 text-[13px] font-semibold text-[--color-accent-ink] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            أرسِل إشعاراً تجريبياً
          </button>
        )}
      </div>

      {busy ? (
        <span className="grid h-[31px] w-[51px] shrink-0 place-items-center text-[--color-muted]">
          <Spinner size={16} />
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={granted}
          aria-label={granted ? "إيقاف التذكيرات" : "تفعيل التذكيرات"}
          onClick={granted ? turnOff : enable}
          disabled={busy}
          className="press shrink-0 rounded-full disabled:opacity-50"
        >
          <Switch on={granted} />
        </button>
      )}
    </div>
  );
}
