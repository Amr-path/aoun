"use client";
// عون — رفيق «البُرعم» الحيّ: ينمو ويبتسم مع تقدّم يومك، ويتمايل عند نقره.
import { useState } from "react";

interface Props {
  done: number;
  due: number;
}

export default function CompanionSprout({ done, due }: Props) {
  const ratio = due > 0 ? Math.min(done / due, 1) : 0;
  const allDone = due > 0 && done >= due;
  const [wiggle, setWiggle] = useState(false);

  const scale = 0.5 + ratio * 0.5;
  const poke = () => {
    setWiggle(true);
    window.setTimeout(() => setWiggle(false), 450);
  };

  const message = allDone
    ? "تفتّحنا اليوم — شكراً لك 🌸"
    : ratio === 0
      ? "لنبدأ يومنا معاً 🌱"
      : ratio < 0.5
        ? "خطوةٌ جيدة… أكمِل!"
        : "أوشكنا على التفتّح!";

  return (
    <div className="card flex items-center gap-4 p-4">
      <button
        type="button"
        onClick={poke}
        aria-label="رفيقك"
        className={`shrink-0 ${wiggle ? "animate-wiggle" : ""}`}
      >
        <svg width="64" height="64" viewBox="0 0 100 100" aria-hidden>
          {/* الأصيص */}
          <path d="M37 79 L63 79 L59 93 L41 93 Z" fill="#c69c74" />
          <ellipse cx="50" cy="79" rx="13" ry="3" fill="#8a6647" />

          {/* النبتة (تنمو بالمقياس من قاعدة الأصيص) */}
          <g
            style={{
              transformOrigin: "50px 79px",
              transform: `scale(${scale})`,
              transition: "transform .6s var(--ease-spring)",
            }}
          >
            <path
              d="M50 79 Q 47 55 50 41"
              fill="none"
              stroke="var(--color-sage)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* ورقتان */}
            <path d="M50 60 C 42 58 37 52 35 46 C 43 46 49 52 50 60 Z" fill="var(--color-sage)" />
            <path d="M50 55 C 58 53 63 48 65 42 C 57 42 51 47 50 55 Z" fill="#8fbf9c" />

            {/* زهرة عند اكتمال اليوم */}
            {allDone && (
              <g>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse
                    key={a}
                    cx="50"
                    cy="18"
                    rx="3.2"
                    ry="6"
                    fill="var(--color-blush)"
                    transform={`rotate(${a} 50 26)`}
                  />
                ))}
                <circle cx="50" cy="26" r="3" fill="var(--color-amber)" />
              </g>
            )}

            {/* الرأس والوجه */}
            <circle cx="50" cy="34" r="11" fill="var(--color-sage)" />
            {allDone ? (
              <>
                <path d="M44 32 Q46 29 48 32" fill="none" stroke="#2e2e2b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M52 32 Q54 29 56 32" fill="none" stroke="#2e2e2b" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="46" cy="33" r="1.6" fill="#2e2e2b" />
                <circle cx="54" cy="33" r="1.6" fill="#2e2e2b" />
              </>
            )}
            <path
              d="M45 37 Q50 41 55 37"
              fill="none"
              stroke="#2e2e2b"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>

      <div className="min-w-0">
        <p className="font-semibold text-[--color-ink]">رفيقك</p>
        <p className="text-sm text-[--color-muted]">{message}</p>
      </div>
    </div>
  );
}
