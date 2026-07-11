"use client";
// عون — «زهرة اليوم»: بتلةٌ لكل عادةٍ مستحقّة، تتفتّح بلونها حين تُنجزها.
// المركز «بئرٌ» طافٍ فوق البتلات فلا تتداخل النتيجة معها.
import type { HabitWithStatus } from "@/lib/types";
import { accentOf } from "@/lib/colors";
import { ar } from "@/lib/numerals";

// بتلةٌ ناعمة تترك فراغاً حول المركز (قاعدتها عند y=52، والمركز 60).
const PETAL = "M60 52 C 47 42 47 24 60 11 C 73 24 73 42 60 52 Z";

interface Props {
  habits: HabitWithStatus[];
  score: number;
  size?: number;
}

export default function FlowerScore({ habits, score, size = 176 }: Props) {
  const due = habits.filter((h) => h.dueToday);
  const n = Math.max(due.length, 1);
  const allDone = due.length > 0 && due.every((h) => h.completedToday);

  return (
    <div
      className={`relative inline-grid place-items-center ${allDone ? "animate-breathe" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
        <defs>
          <filter id="petalLift" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.6" floodColor="rgba(60,50,40,0.14)" />
          </filter>
          <filter id="wellShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(60,50,40,0.20)" />
          </filter>
        </defs>

        {due.length === 0 ? (
          <circle cx="60" cy="60" r="18" fill="var(--color-surface-3)" />
        ) : (
          <g filter="url(#petalLift)">
            {due.map((h, i) => {
              const angle = (i * 360) / n;
              const accent = accentOf(h.colorKey);
              const done = h.completedToday;
              return (
                <g key={h.id} transform={`rotate(${angle} 60 60)`}>
                  <path
                    d={PETAL}
                    fill={done ? accent : "transparent"}
                    stroke={accent}
                    strokeWidth={done ? 0 : 1.5}
                    style={{
                      opacity: done ? 0.9 : 0.28,
                      transformOrigin: "60px 60px",
                      transform: done ? "scale(1)" : "scale(0.8)",
                      transition:
                        "transform .6s var(--ease-spring), opacity .5s ease, fill .5s ease",
                    }}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* بئر المركز — طافٍ فوق البتلات */}
        <circle
          cx="60"
          cy="60"
          r="25"
          fill="var(--color-surface)"
          stroke={allDone ? "var(--color-sage)" : "var(--color-hairline)"}
          strokeWidth={allDone ? 1.5 : 1}
          filter="url(#wellShadow)"
          style={{ transition: "stroke .5s ease" }}
        />
      </svg>

      {/* النتيجة في قلب البئر */}
      <div className="absolute grid place-items-center text-center">
        <span className="score font-[family-name:var(--font-display)] text-[28px] font-black leading-none text-[--color-ink]">
          {ar(Math.max(0, Math.min(100, score)))}
        </span>
        <span className="mt-0.5 text-[10px] text-[--color-muted]">
          {allDone ? "تفتّحت 🌸" : "نتيجة اليوم"}
        </span>
      </div>
    </div>
  );
}
