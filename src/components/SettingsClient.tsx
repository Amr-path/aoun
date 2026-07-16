"use client";
// عون — صفحة الإعدادات: الحساب، المنطقة الزمنية، المظهر، الإشعارات، الخروج.
// بروح «نقاء»: مجموعات iOS — بطاقات بيضاء، فواصل شعرية، وعناوين أقسام خافتة.
import { useState, type ReactNode } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import NotificationsToggle from "./NotificationsToggle";
import LogoutButton from "./LogoutButton";
import HabitManager from "./HabitManager";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/store/toast";

// أسماء عربية + إزاحة تقريبية (قد تختلف بساعةٍ صيفاً في المناطق التي تطبّق التوقيت الصيفي).
const TIMEZONES: { id: string; label: string }[] = [
  { id: "Asia/Riyadh", label: "الرياض (GMT+3)" },
  { id: "Asia/Dubai", label: "دبي (GMT+4)" },
  { id: "Asia/Kuwait", label: "الكويت (GMT+3)" },
  { id: "Asia/Qatar", label: "الدوحة (GMT+3)" },
  { id: "Asia/Baghdad", label: "بغداد (GMT+3)" },
  { id: "Asia/Amman", label: "عمّان (GMT+3)" },
  { id: "Asia/Beirut", label: "بيروت (GMT+2)" },
  { id: "Africa/Cairo", label: "القاهرة (GMT+2)" },
  { id: "Africa/Khartoum", label: "الخرطوم (GMT+2)" },
  { id: "Africa/Casablanca", label: "الدار البيضاء (GMT+1)" },
  { id: "Africa/Algiers", label: "الجزائر (GMT+1)" },
  { id: "Africa/Tunis", label: "تونس (GMT+1)" },
  { id: "Europe/London", label: "لندن (GMT+0)" },
  { id: "America/New_York", label: "نيويورك (GMT−5)" },
];

interface Props {
  initialName: string;
  email: string;
  initialTz: string;
}

// حقل iOS: إدراجٌ رماديّ هادئ بلا حدودٍ ولا ظلالٍ غائرة.
const FIELD_CLASS =
  "rounded-[10px] border-0 bg-[--color-surface-2] px-3.5 py-2.5 text-[--color-ink] outline-none focus:ring-2 focus:ring-[--color-accent]";

// عنوان قسمٍ بأسلوب إعدادات iOS — كلمةٌ خافتة صغيرة بلا زخرفة.
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 mt-7 px-4 text-[13px] font-medium text-[--color-faint]">{children}</p>
  );
}

export default function SettingsClient({ initialName, email, initialTz }: Props) {
  const [name, setName] = useState(initialName);
  const [tz, setTz] = useState(initialTz);
  const [busy, setBusy] = useState(false);
  const toast = useToast((s) => s.show);

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, timezone: tz }),
      });
      toast(res.ok ? "تم حفظ التغييرات" : "تعذّر الحفظ، حاول مجدداً", {
        kind: res.ok ? "success" : "error",
      });
    } catch {
      toast("تعذّر الاتصال", { kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-32 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <Logo size={28} withWordmark />
        <Link
          href="/dashboard"
          className="press inline-flex items-center gap-1 text-[17px] text-[--color-accent-ink]"
        >
          <Icon name="chevron" size={17} className="scale-x-[-1]" />
          اللوحة
        </Link>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[--color-ink]">
        الإعدادات
      </h1>

      {/* الحساب */}
      <SectionLabel>الحساب</SectionLabel>
      <section className="card p-4">
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-[13px] text-[--color-muted]">الاسم</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={FIELD_CLASS} />
        </label>
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-[13px] text-[--color-muted]">البريد</span>
          <input
            value={email}
            disabled
            className="rounded-[10px] border-0 bg-[--color-surface-2] px-3.5 py-2.5 text-[--color-faint] outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[--color-muted]">المنطقة الزمنية</span>
          <select value={tz} onChange={(e) => setTz(e.target.value)} className={FIELD_CLASS}>
            {TIMEZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="btn-clay press px-7 py-2.5 font-semibold disabled:opacity-60"
          >
            {busy ? (
              <span className="inline-flex items-center justify-center">
                <Spinner />
              </span>
            ) : (
              "حفظ"
            )}
          </button>
        </div>
      </section>

      {/* إدارة العادات — التعديل هنا فقط؛ اللوحة للإنجاز والأصل الثبات */}
      <SectionLabel>عاداتك</SectionLabel>
      <p className="-mt-1 mb-3 px-4 text-xs leading-relaxed text-[--color-faint]">
        هنا وحدها تُعدَّل العادة أو تُحذف — أبقينا لوحتك اليومية للإنجاز فقط.
      </p>
      <HabitManager />

      {/* الترقية إلى عون بلس — صفُّ بطاقةٍ نظيف */}
      <Link href="/plus" className="card press lift mt-4 flex items-center gap-3 p-4">
        <span
          className="icon-chip h-8 w-8 shrink-0 rounded-[10px] text-[--color-amber-ink]"
          style={{ background: "var(--color-amber-soft)" }}
        >
          <Icon name="spark" size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[--color-ink]">عون بلس</span>
          <span className="block text-[13px] text-[--color-muted]">
            افتح كامل التجربة وادعم التطوير
          </span>
        </span>
        <Icon name="chevron" size={17} className="shrink-0 text-[--color-faint]" />
      </Link>

      {/* المظهر والتنبيهات */}
      <SectionLabel>المظهر والتنبيهات</SectionLabel>
      <ThemeToggle />
      <NotificationsToggle />

      {/* الجلسة — صفُّ خروجٍ تدميريّ بأسلوب iOS: نصٌّ أحمر مركّز داخل بطاقة */}
      <SectionLabel>الجلسة</SectionLabel>
      <div className="card overflow-hidden [&_button]:w-full [&_button]:justify-center [&_button]:rounded-none [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-3.5 [&_button]:text-[--color-danger] [&_button:hover]:bg-[--color-surface-2]">
        <LogoutButton />
      </div>
    </main>
  );
}
