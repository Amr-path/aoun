"use client";
// عون — صفحة الإعدادات: الحساب، المنطقة الزمنية، المظهر، الإشعارات، الخروج.
// بروح «واحة» الهادئة: بطاقاتٌ طينية منفوخة، حقولٌ غائرة في العجين، وعناوينُ أقسامٍ بتظليل الزبدة.
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

// عنوان مجموعةٍ بين فاصلَي خرز — كلمةٌ قصيرة مُظلَّلة بالزبدة.
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
          className="press pill inline-flex items-center gap-1.5 border border-[--color-hairline-soft] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] shadow-[var(--shadow-top),0_3px_0_0_var(--edge)] transition-colors hover:bg-[--color-surface-2]"
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
            className="rounded-2xl border-0 bg-[--color-surface-2] px-3.5 py-2.5 text-[--color-ink] shadow-[inset_0_2px_3px_rgba(96,66,30,0.14)] outline-none transition-shadow focus:shadow-[inset_0_2px_3px_rgba(96,66,30,0.14),0_0_0_2.5px_var(--color-accent)]"
          />
        </label>
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">البريد</span>
          <input
            value={email}
            disabled
            className="rounded-2xl border-0 bg-[--color-surface-3] px-3.5 py-2.5 text-[--color-faint] shadow-[inset_0_2px_3px_rgba(96,66,30,0.14)] outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">المنطقة الزمنية</span>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="rounded-2xl border-0 bg-[--color-surface-2] px-3.5 py-2.5 text-[--color-ink] shadow-[inset_0_2px_3px_rgba(96,66,30,0.14)] outline-none transition-shadow focus:shadow-[inset_0_2px_3px_rgba(96,66,30,0.14),0_0_0_2.5px_var(--color-accent)]"
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
            className="btn-clay px-7 py-2.5 font-bold disabled:opacity-60"
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

      {/* الترقية إلى عون بلس — بطاقةُ زبدةٍ طينية */}
      <Link
        href="/plus"
        className="press lift mt-4 flex items-center gap-3 rounded-[--radius-card] border border-[--color-hairline-soft] p-4 shadow-[var(--shadow-top),var(--shadow-1)]"
        style={{ background: "var(--color-amber-soft)" }}
      >
        <span
          className="icon-chip h-10 w-10 shrink-0 text-[--color-amber-ink]"
          style={{ background: "var(--grad-sunrise)" }}
        >
          <Icon name="spark" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[--color-amber-ink]">عون بلس</span>
          <span className="block text-xs text-[--color-amber-ink] opacity-80">
            افتح كامل التجربة وادعم التطوير
          </span>
        </span>
        <Icon name="chevron" size={18} className="text-[--color-amber-ink]" />
      </Link>

      {/* المظهر والتنبيهات */}
      <SectionLabel>المظهر والتنبيهات</SectionLabel>
      <ThemeToggle />
      <NotificationsToggle />

      {/* الجلسة — زرّ الخروج بهدوءِ الخطر: حبّةٌ ورديةٌ ناعمة بحبرٍ غامق، بلا تعبئةٍ صارخة */}
      <SectionLabel>الجلسة</SectionLabel>
      <div className="flex justify-center [&_button:active]:shadow-none [&_button]:border-0 [&_button]:bg-[--color-danger-soft] [&_button]:text-[--color-danger-ink] [&_button]:shadow-[0_3px_0_0_var(--edge)]">
        <LogoutButton />
      </div>

      <BottomNav />
    </main>
  );
}
