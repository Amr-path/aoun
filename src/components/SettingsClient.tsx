"use client";
// عون — صفحة الإعدادات: الحساب، المنطقة الزمنية، المظهر، الإشعارات، الخروج.
import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import NotificationsToggle from "./NotificationsToggle";
import LogoutButton from "./LogoutButton";

const TIMEZONES = [
  "Asia/Riyadh",
  "Asia/Dubai",
  "Asia/Kuwait",
  "Asia/Qatar",
  "Asia/Baghdad",
  "Asia/Amman",
  "Asia/Beirut",
  "Africa/Cairo",
  "Africa/Khartoum",
  "Africa/Casablanca",
  "Africa/Algiers",
  "Africa/Tunis",
  "Europe/London",
  "America/New_York",
];

interface Props {
  initialName: string;
  email: string;
  initialTz: string;
}

export default function SettingsClient({ initialName, email, initialTz }: Props) {
  const [name, setName] = useState(initialName);
  const [tz, setTz] = useState(initialTz);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, timezone: tz }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-24 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <Logo size={28} withWordmark />
        <Link
          href="/dashboard"
          className="pill border border-[--color-border] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
        >
          ← اللوحة
        </Link>
      </div>

      <h1 className="mb-5 font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
        الإعدادات
      </h1>

      {/* الحساب */}
      <section className="card p-5">
        <h2 className="mb-4 font-semibold text-[--color-ink]">الحساب</h2>
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">الاسم</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-[--color-hairline] bg-[--color-surface] px-3 py-2.5 text-[--color-ink] outline-none focus:border-[--color-sage]"
          />
        </label>
        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">البريد</span>
          <input
            value={email}
            disabled
            className="rounded-xl border border-[--color-hairline] bg-[--color-surface-2] px-3 py-2.5 text-[--color-faint] outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[--color-muted]">المنطقة الزمنية</span>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="rounded-xl border border-[--color-hairline] bg-[--color-surface] px-3 py-2.5 text-[--color-ink] outline-none focus:border-[--color-sage]"
          >
            {TIMEZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="pill px-6 py-2.5 font-semibold text-white transition-transform active:scale-95 disabled:opacity-60"
            style={{ background: "var(--color-sage)" }}
          >
            {busy ? "…" : "حفظ"}
          </button>
          {saved && <span className="text-sm text-[--color-sage-ink]">تم الحفظ ✓</span>}
        </div>
      </section>

      {/* المظهر */}
      <div className="mt-4">
        <ThemeToggle />
      </div>

      {/* الإشعارات */}
      <NotificationsToggle />

      {/* الخروج */}
      <div className="mt-6 flex justify-center">
        <LogoutButton />
      </div>
    </main>
  );
}
