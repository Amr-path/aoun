"use client";
// عون — بطاقة «حصادي» قابلة للتصدير كصورة للمشاركة، تحت سماء أصيلٍ نحاسيّة.
import { useRef, useState } from "react";
import Link from "next/link";
import * as htmlToImage from "html-to-image";
import { ar } from "@/lib/numerals";
import { LOGO_PETAL } from "@/lib/marks";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";

const PETAL = "M60 52 C 47 42 47 24 60 11 C 73 24 73 42 60 52 Z";
// حديقةُ العادات السبع — بلوحةٍ ثابتة تُطابق الهوية الجديدة (تصدير PNG متّسق)
const PETAL_COLORS = ["#5C9A64", "#3E9088", "#4E93C4", "#7C7FD0", "#D07EA0", "#CE7F52", "#D9A23C"];
const ANGLES = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);
// ماء الذهب بلوحةٍ ثابتة (لا يتبع وضع الغسق كي يبقى التصدير متّسقاً)
const GILD_FIXED = "linear-gradient(105deg, #a8712c 0%, #e5aa52 45%, #b97f2e 100%)";

interface Props {
  name: string | null;
  currentStreak: number;
  bestStreak: number;
  activeDays: number;
  totalCompletions: number;
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#221F1B", lineHeight: 1 }}>
        {ar(value)}
      </div>
      <div style={{ fontSize: 12, color: "#6B655C", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function HarvestClient({
  name,
  currentStreak,
  bestStreak,
  activeDays,
  totalCompletions,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await htmlToImage.toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "حصادي-مع-عون.png";
      a.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-5 pb-24 pt-6">
      {/* ترويسة سماء الغروب — للحصاد لونُ الأصيل، ساعةُ جنيِ الثمر */}
      <section
        className="sky-panel sky-sunset relative mb-6 w-full overflow-hidden rounded-[--radius-xl] border border-[--color-hairline-soft]"
        style={{ boxShadow: "var(--shadow-top), var(--shadow-1)" }}
      >
        <div
          aria-hidden
          className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]"
        />
        <div className="relative flex items-center justify-between gap-3 px-5 py-5">
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-black">
              حصادي
            </h1>
            <p className="sky-muted quote-seed mt-1 text-sm leading-relaxed">
              ما زرعتَه صبراً، تجنيه ذهباً
            </p>
          </div>
          <Link
            href="/analytics"
            className="press pill sky-chip inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm font-medium"
          >
            <Icon name="chevron" size={15} className="scale-x-[-1]" />
            رجوع
          </Link>
        </div>
      </section>

      {/* إطار «بطاقة ضوء» بهمسة خاتمٍ خلف البطاقة (خارج عقدة التصدير فلا تدخل في الصورة) */}
      <div
        className="relative overflow-hidden rounded-[--radius-xl] p-2 shadow-[var(--shadow-lg)]"
        style={{ background: "var(--color-surface-2)" }}
      >
        <div
          aria-hidden
          className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]"
        />
        {/* البطاقة (بلوحة ثابتة فاتحة لتصديرٍ متّسق) */}
        <div
          ref={ref}
          dir="rtl"
          className="relative"
          style={{
            width: 360,
            maxWidth: "100%",
            background:
              "radial-gradient(24rem 16rem at 80% 0%, rgba(224,145,58,.18), transparent 60%), radial-gradient(22rem 15rem at 0% 20%, rgba(124,127,208,.14), transparent 58%), #FAF6F0",
            border: "1px solid #EAE3D8",
            borderRadius: 28,
            padding: "28px 24px 24px",
            fontFamily: "var(--font-display), var(--font-arabic), sans-serif",
            color: "#221F1B",
            boxSizing: "border-box",
          }}
        >
          {/* العلامة */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 48 48">
              <defs>
                <linearGradient id="mark-sunrise" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F0B75C" />
                  <stop offset="0.55" stopColor="#E0913A" />
                  <stop offset="1" stopColor="#D06E3C" />
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="14" fill="url(#mark-sunrise)" />
              <g fill="#FAF6F0" opacity="0.94">
                {ANGLES.map((a) => (
                  <path
                    key={a}
                    d={LOGO_PETAL}
                    transform={`rotate(${a.toFixed(2)} 24 24)`}
                  />
                ))}
              </g>
              <circle cx="24" cy="24" r="3" fill="#96560F" />
            </svg>
            <span style={{ fontSize: 20, fontWeight: 800 }}>عون</span>
          </div>

          {/* الزهرة */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <div style={{ position: "relative", width: 180, height: 180 }}>
              <svg width="180" height="180" viewBox="0 0 120 120">
                {ANGLES.map((a, i) => (
                  <path
                    key={a}
                    d={PETAL}
                    transform={`rotate(${a} 60 60)`}
                    fill={PETAL_COLORS[i]}
                    opacity={0.9}
                  />
                ))}
                <circle cx="60" cy="60" r="25" fill="#FFFCF8" stroke="#E0913A" strokeWidth="1.5" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* الرقم البطل بماء الذهب — بلوحةٍ ثابتة ليخرج في التصدير كما يظهر */}
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    background: GILD_FIXED,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {ar(bestStreak)}
                </span>
                <span style={{ fontSize: 10, color: "#6B655C", marginTop: 2 }}>أفضل مداومة</span>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 15, color: "#6B655C", margin: "6px 0 18px" }}>
            {name ? `حصادُ ${name} مع عون` : "حصادي مع عون"}
          </p>

          {/* الإحصاءات */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              background: "#FFFCF8",
              border: "1px solid #EAE3D8",
              borderRadius: 18,
              padding: "16px 12px",
            }}
          >
            <Stat value={currentStreak} label="مداومة حالية" />
            <Stat value={activeDays} label="أيام نشطة" />
            <Stat value={totalCompletions} label="إتمامات" />
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9B9184", marginTop: 18 }}>
            عون — رفيقك للاستمرار
          </p>
        </div>
      </div>

      {/* تنويه التصدير بين زخرفتين ذهبيّتين */}
      <div className="mt-3 flex w-full items-center gap-3">
        <span className="ornament-line" aria-hidden />
        <p className="whitespace-nowrap text-center text-xs text-[--color-faint]">
          تُصدَّر البطاقة بخلفيةٍ فاتحة دائماً لتتّسق عبر الأجهزة
        </p>
        <span className="ornament-line rev" aria-hidden />
      </div>

      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="pill press mt-6 w-full py-3.5 text-center font-bold disabled:opacity-60"
        style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}
      >
        {busy ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner size={16} />
            نُجهّز الصورة
          </span>
        ) : (
          "تنزيل صورة الحصاد"
        )}
      </button>
    </main>
  );
}
