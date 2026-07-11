"use client";
// عون — نموذج الدخول/التسجيل.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { name, email, password } : { email, password };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setErr(d.error || "حدث خطأ، حاول مجدداً");
        setBusy(false);
        return;
      }
      router.push(isRegister ? "/onboarding" : "/dashboard");
      router.refresh();
    } catch {
      setErr("تعذّر الاتصال");
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo variant="badge" size={64} animated className="mb-4" />
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-black text-[--color-ink]">
          {isRegister ? "أنشئ حسابك" : "أهلاً بعودتك"}
        </h1>
        <p className="mt-1 text-sm text-[--color-muted]">
          {isRegister ? "ابدأ رحلتك مع عون" : "واصِل مداومتك"}
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {isRegister && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم (اختياري)"
            className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-4 py-3 text-[--color-ink] outline-none transition-colors placeholder:text-[--color-faint] focus:border-[--color-accent]"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          autoComplete="email"
          required
          className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-4 py-3 text-[--color-ink] outline-none transition-colors placeholder:text-[--color-faint] focus:border-[--color-accent]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-4 py-3 text-[--color-ink] outline-none transition-colors placeholder:text-[--color-faint] focus:border-[--color-accent]"
        />

        {err && <p className="text-sm text-[--color-danger-ink]">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="press pill mt-2 bg-[--color-ink] py-3.5 text-center font-bold text-[--color-cream] shadow-[var(--shadow-2)] disabled:opacity-60"
        >
          {busy ? "…" : isRegister ? "إنشاء الحساب" : "دخول"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[--color-muted]">
        {isRegister ? "لديك حساب؟" : "جديد هنا؟"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(isRegister ? "login" : "register");
            setErr("");
          }}
          className="font-semibold text-[--color-accent-ink] hover:underline"
        >
          {isRegister ? "سجّل الدخول" : "أنشئ حساباً"}
        </button>
      </p>
    </div>
  );
}
