"use client";
// عون — نموذج الدخول/التسجيل.
import { useState } from "react";
import { useRouter } from "next/navigation";
import FlowerMark from "./FlowerMark";
import Spinner from "@/components/ui/Spinner";

// حقل iOS: إدراجٌ رماديّ هادئ بلا حدودٍ ولا ظلالٍ غائرة.
const FIELD_CLASS =
  "w-full rounded-[10px] border-0 bg-[--color-surface-2] px-4 py-3 text-[--color-ink] transition-shadow placeholder:text-[--color-faint] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[--color-danger]";

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
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[--color-ink]">
          {isRegister ? "أنشئ حسابك" : "أهلاً بعودتك"}
        </h1>
        <p className="mt-2 text-[15px] text-[--color-muted]">
          {isRegister ? "أوّلُ يومٍ في مداومتك" : "أكمِل من حيث توقّفت"}
        </p>
      </div>

      {/* بطاقةٌ بيضاء نظيفة تحتضن النموذج */}
      <div className="card rounded-[--radius-xl] p-6">
        <form onSubmit={submit} className="flex flex-col gap-3">
          {isRegister && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم (اختياري)"
              className={FIELD_CLASS}
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
            />
            {fieldErr.email && <p className="text-[13px] text-[--color-danger-ink]">{fieldErr.email}</p>}
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
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute inset-y-0 end-3 my-auto h-fit text-[13px] font-semibold text-[--color-accent-ink] transition-opacity hover:opacity-80"
              >
                {showPw ? "إخفاء" : "إظهار"}
              </button>
            </div>
            {fieldErr.password && (
              <p className="text-[13px] text-[--color-danger-ink]">{fieldErr.password}</p>
            )}
          </div>

          {err && <p className="text-sm text-[--color-danger-ink]">{err}</p>}

          <button
            type="submit"
            disabled={busy}
            className="btn-clay press mt-2 w-full rounded-[12px] py-3 text-center text-[17px] font-semibold disabled:opacity-60"
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

      {/* التبديل بين الدخول والتسجيل — زرٌّ نصيّ بلون النظام */}
      <p className="mt-6 text-center text-sm text-[--color-muted]">
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
    </div>
  );
}
