"use client";
// عون — بطاقة «حصادي» قابلة للتصدير كصورة للمشاركة، بلوحة «نقاء» الفاتحة الثابتة.
import { useRef, useState } from "react";
import Link from "next/link";
import * as htmlToImage from "html-to-image";
import { ar } from "@/lib/numerals";
import { LOGO_PETAL } from "@/lib/marks";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";

const PETAL = "M60 52 C 47 42 47 24 60 11 C 73 24 73 42 60 52 Z";
// حديقةُ العادات السبع — لوحة iOS المصقولة بقيمٍ ثابتة (تصدير PNG متّسق)
const PETAL_COLORS = ["#34b26b", "#30b0c7", "#2e93fa", "#7d7aff", "#ff6482", "#ff9f0a", "#ffcc00"];
const ANGLES = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);
// لوحة «نقاء» النهارية الثابتة داخل عقدة التصدير (لا تتبع وضع الغسق كي يبقى التصدير متّسقاً)
const EXPORT_BG = "#f2f2f7";
const EXPORT_CARD = "#ffffff";
const EXPORT_INK = "#1c1c1e";
const EXPORT_MUTED = "#66666c";
const EXPORT_FAINT = "#8e8e93";
const EXPORT_ACCENT = "#2fa36b";
const EXPORT_AMBER = "#ffcc00";
const EXPORT_EDGE = "#e5e5ea";

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
      <div style={{ fontSize: 26, fontWeight: 800, color: EXPORT_INK, lineHeight: 1 }}>
        {ar(value)}
      </div>
      <div style={{ fontSize: 12, color: EXPORT_MUTED, marginTop: 4 }}>{label}</div>
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

  // مشاركةٌ أصيلة عبر ورقة النظام إن توفّرت (الجوّال غالباً)، وإلا تنزيلٌ كالسابق.
  const share = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await htmlToImage.toPng(ref.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "aoun.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (err) {
          // ألغى المستخدم ورقة المشاركة — لا نُغرقه بتنزيلٍ لم يطلبه.
          if (err instanceof DOMException && err.name === "AbortError") return;
          // فشلٌ آخر: ننزل إلى التنزيل المباشر.
        }
      }

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
      {/* ترويسةُ صباحٍ زبدية — الحصاد تحت شمسٍ دافئة */}
      <section className="sky-panel sky-morning relative mb-6 w-full overflow-hidden rounded-[--radius-xl]">
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
            className="press pill sky-chip inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm font-bold"
          >
            <Icon name="chevron" size={15} className="scale-x-[-1]" />
            رجوع
          </Link>
        </div>
      </section>

      {/* إطارُ البطاقة: خليةٌ بيضاء بظلٍّ عميق (خارج عقدة التصدير فلا يدخل في الصورة) */}
      <div className="card overflow-hidden rounded-[--radius-xl] p-2 shadow-[var(--shadow-lg)]">
        {/* البطاقة (بلوحة «نقاء» الفاتحة الثابتة المسطّحة — بلا تدرّجات — لتصديرٍ متّسق) */}
        <div
          ref={ref}
          dir="rtl"
          className="relative"
          style={{
            width: 360,
            maxWidth: "100%",
            background: EXPORT_BG,
            borderRadius: 14,
            padding: "28px 24px 24px",
            fontFamily: "var(--font-display), var(--font-arabic), sans-serif",
            color: EXPORT_INK,
            boxSizing: "border-box",
          }}
        >
          {/* العلامة */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 48 48">
              <rect width="45" height="45" x="1.5" y="1.5" rx="14" fill={EXPORT_ACCENT} />
              <g fill={EXPORT_CARD} opacity="0.94">
                {ANGLES.map((a) => (
                  <path
                    key={a}
                    d={LOGO_PETAL}
                    transform={`rotate(${a.toFixed(2)} 24 24)`}
                  />
                ))}
              </g>
              <circle cx="24" cy="24" r="3" fill={EXPORT_AMBER} />
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
                <circle cx="60" cy="60" r="25" fill={EXPORT_CARD} stroke={EXPORT_EDGE} strokeWidth="2" />
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
                {/* الرقم البطل بلون النظام المسطّح — hex ثابت ليخرج في التصدير كما يظهر */}
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: EXPORT_ACCENT,
                  }}
                >
                  {ar(bestStreak)}
                </span>
                <span style={{ fontSize: 10, color: EXPORT_MUTED, marginTop: 2 }}>أفضل مداومة</span>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 15, color: EXPORT_MUTED, margin: "6px 0 18px" }}>
            {name ? `حصادُ ${name} مع عون` : "حصادي مع عون"}
          </p>

          {/* الإحصاءات */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              background: EXPORT_CARD,
              borderRadius: 16,
              boxShadow: "0 0 0 0.5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.06)",
              padding: "16px 12px",
            }}
          >
            <Stat value={currentStreak} label="مداومة حالية" />
            <Stat value={activeDays} label="أيام نشطة" />
            <Stat value={totalCompletions} label="إتمامات" />
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: EXPORT_FAINT, marginTop: 18 }}>
            عون — رفيقك للاستمرار
          </p>
        </div>
      </div>

      {/* تنويه التصدير بين فاصلَي خرز */}
      <div className="mt-3 flex w-full items-center gap-3">
        <span className="ornament-line" aria-hidden />
        <p className="whitespace-nowrap text-center text-xs text-[--color-faint]">
          تُصدَّر البطاقة بخلفيةٍ فاتحة دائماً لتتّسق عبر الأجهزة
        </p>
        <span className="ornament-line rev" aria-hidden />
      </div>

      <button
        type="button"
        onClick={share}
        disabled={busy}
        className="btn-clay mt-6 w-full py-3.5 text-center font-bold disabled:opacity-60"
      >
        {busy ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner size={16} />
            نُجهّز الصورة
          </span>
        ) : (
          "مشاركة الحصاد"
        )}
      </button>
    </main>
  );
}
