"use client";
// عون — صفحة الإعدادات: الحساب، المنطقة الزمنية، المظهر، الإشعارات، الخروج.
// بروح «مِشكاة» الهادئة: فواصل مُزخرفة وعناوين مُذهّبة بهمسٍ — الذهب هنا بهارٌ لا صلصة.
import { useState, type ReactNode } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import NotificationsToggle from "./NotificationsToggle";
import LogoutButton from "./LogoutButton";
import BottomNav from "./BottomNav";
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

// عنوان مجموعةٍ بين زخرفتين — بماء ذهبٍ خافت، على طراز فواصل المخطوطات.
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center gap-3 px-1">
      <span className="ornament-line" aria-hidden />
      <span className="text-gild whitespace-nowrap text-xs font-bold">{children}</span>
      <span className="ornament-line rev" aria-hidden />
    </div>
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
          className="press pill inline-flex items-center gap-1.5 border border-[--color-hairline] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
        >
          <Icon name="chevron" size={16} className="scale-x-[-1]" />
          اللوحة
        </Link>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
        الإعدادات
      </h1>

      {/* الحساب */}
      <SectionLabel>الحساب</SectionLabel>
      <section className="card p-5">
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">الاسم</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-3 py-2.5 text-[--color-ink] outline-none transition-colors focus:border-[--color-accent]"
          />
        </label>
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">البريد</span>
          <input
            value={email}
            disabled
            className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface-2] px-3 py-2.5 text-[--color-faint] outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">المنطقة الزمنية</span>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-3 py-2.5 text-[--color-ink] outline-none transition-colors focus:border-[--color-accent]"
          >
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
            className="press pill bg-[--color-ink] px-6 py-2.5 font-semibold text-[--color-cream] shadow-[var(--shadow-2)] disabled:opacity-60"
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

      {/* الترقية إلى عون بلس */}
      <Link
        href="/plus"
        className="press mt-4 flex items-center gap-3 rounded-[--radius-card] p-4"
        style={{
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-accent)",
          boxShadow: "var(--shadow-top), var(--shadow-1)",
        }}
      >
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[--radius-md]"
          style={{ background: "var(--grad-cta)" }}
        >
          <Icon name="spark" size={18} className="text-[--color-cream]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[--color-accent-ink]">عون بلس</span>
          <span className="block text-xs text-[--color-accent-ink] opacity-80">
            افتح كامل التجربة وادعم التطوير
          </span>
        </span>
        <Icon name="chevron" size={18} className="text-[--color-accent-ink]" />
      </Link>

      {/* المظهر والتنبيهات */}
      <SectionLabel>المظهر والتنبيهات</SectionLabel>
      <ThemeToggle />
      <NotificationsToggle />

      {/* الجلسة */}
      <SectionLabel>الجلسة</SectionLabel>
      <div className="flex justify-center">
        <LogoutButton />
      </div>

      <BottomNav />
    </main>
  );
}
