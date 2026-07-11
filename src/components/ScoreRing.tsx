"use client";
// عون — حلقة النتيجة اليومية بتدرّج هادئ (ساج ← لافندر) وتنفّسٍ عند الاكتمال.
import { ar } from "@/lib/numerals";

interface Props {
  score: number; // 0..100
  size?: number;
}

export default function ScoreRing({ score, size = 132 }: Props) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c * (1 - clamped / 100);
  const complete = clamped >= 100;

  return (
    <div
      className={`relative inline-grid place-items-center ${complete ? "animate-breathe" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id="gps-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-sage)" />
            <stop offset="100%" stopColor="var(--color-lavender)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-surface-3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#gps-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s var(--ease-soft)" }}
        />
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="score font-[family-name:var(--font-display)] text-4xl font-black leading-none text-[--color-ink]">
          {ar(clamped)}
        </span>
        <span className="mt-1 text-[11px] text-[--color-muted]">نتيجة اليوم</span>
      </div>
    </div>
  );
}
