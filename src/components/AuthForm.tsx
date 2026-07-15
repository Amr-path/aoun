"use client";
// عون — نموذج الدخول/التسجيل.
import { useState } from "react";
import { useRouter } from "next/navigation";
import FlowerMark from "./FlowerMark";
import Spinner from "@/components/ui/Spinner";

// حقلٌ طينيّ غائر: قناةٌ ناعمة تحتضن الكتابة، بلا حدودٍ قاسية.
const FIELD_CLASS =
  "w-full rounded-2xl border border-[--color-hairline-soft] bg-[--color-surface-2] px-4 py-3 text-[--color-ink] transition-colors placeholder:text-[--color-faint] aria-[invalid=true]:border-[--color-danger]";
const FIELD_SUNKEN = { boxShadow: "inset 0 2px 3px rgba(96, 66, 30, .14)" };

export default function AuthForm({
  initialMode = "login",
}: {
  initialMode?: "login" | "register";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErr, setFieldErr] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";
  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // تحقّق حقليّ inline قبل الإرسال.
    const fe: { email?: string; password?: string } = {};
    if (!emailOk(email)) fe.email = "أدخِل بريداً إلكترونياً صحيحاً";
    if (!password) fe.password = "كلمة المرور مطلوبة";
    else if (isRegister && password.length < 8) fe.password = "ثمانية أحرفٍ على الأقلّ";
    setFieldErr(fe);
    if (fe.email || fe.password) return;

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
        setErr(d.error || "تعذّر إتمام الطلب — حاوِل مرّةً أخرى");
        setBusy(false);
        return;
      }
      router.push(isRegister ? "/onboarding" : "/dashboard");
      router.refresh();
    } catch {
      setErr("تعذّر الاتصال — تحقّق من شبكتك ثم أعِد المحاولة");
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7 flex flex-col items-center text-center">
        <FlowerMark size={64} className="mb-4" />
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[--color-ink]">
          <span className="text-gild">{isRegister ? "أنشئ حسابك" : "أهلاً بعودتك"}</span>
        </h1>
        <p className="quote-seed mt-2 text-base text-[--color-muted]">
          {isRegister ? "أوّلُ يومٍ في مداومتك" : "أكمِل من حيث توقّفت"}
        </p>
      </div>

      {/* بطاقةٌ طينية منفوخة بإطارٍ مُذهّب تحتضن النموذج، وخلفها همسة فقاعات العجين */}
      <div className="card gild-frame relative overflow-hidden rounded-[--radius-xl] p-6">
        <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.04]" />
        <form onSubmit={submit} className="relative flex flex-col gap-3">
        {isRegister && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم (اختياري)"
            className={FIELD_CLASS}
            style={FIELD_SUNKEN}
          />
        )}
        <div className="flex flex-col gap-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErr((f) => ({ ...f, email: undefined }));
            }}
            placeholder="البريد الإلكتروني"
            autoComplete="email"
            aria-invalid={!!fieldErr.email}
            required
            className={FIELD_CLASS}
            style={FIELD_SUNKEN}
          />
          {fieldErr.email && <p className="text-xs text-[--color-danger-ink]">{fieldErr.email}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErr((f) => ({ ...f, password: undefined }));
              }}
              placeholder="كلمة المرور"
              autoComplete={isRegister ? "new-password" : "current-password"}
              aria-invalid={!!fieldErr.password}
              required
              className={`${FIELD_CLASS} pe-16`}
              style={FIELD_SUNKEN}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              className="absolute inset-y-0 end-3 my-auto h-fit text-xs font-semibold text-[--color-muted] transition-colors hover:text-[--color-ink]"
            >
              {showPw ? "إخفاء" : "إظهار"}
            </button>
          </div>
          {fieldErr.password && <p className="text-xs text-[--color-danger-ink]">{fieldErr.password}</p>}
        </div>

        {err && <p className="text-sm text-[--color-danger-ink]">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-clay press mt-2 w-full py-3.5 text-center font-bold disabled:opacity-60"
        >
          {busy ? (
            <span className="inline-flex items-center justify-center">
              <Spinner />
            </span>
          ) : isRegister ? (
            "إنشاء الحساب"
          ) : (
            "دخول"
          )}
        </button>
        </form>
      </div>

      {/* التبديل بين الدخول والتسجيل — بين خيطي خرزٍ هادئين */}
      <div className="mt-6 flex items-center gap-3">
        <span aria-hidden className="ornament-line" />
        <p className="shrink-0 text-center text-sm text-[--color-muted]">
          {isRegister ? "لديك حساب؟" : "جديد هنا؟"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? "login" : "register");
              setErr("");
              setFieldErr({});
            }}
            className="font-semibold text-[--color-accent-ink] hover:underline"
          >
            {isRegister ? "سجّل الدخول" : "أنشئ حساباً"}
          </button>
        </p>
        <span aria-hidden className="ornament-line rev" />
      </div>
    </div>
  );
}
