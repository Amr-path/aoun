"use client";
// عون — «زهرة اليوم» تُبنى بتلةً بلونها كلّما أنهيت عادة؛ كلّ بتلةٍ عادةٌ من عاداتك المستحقّة.
import { ar } from "@/lib/numerals";
import { accentOf, accentSoftOf } from "@/lib/colors";
import Icon from "./ui/Icon";

interface HabitLite {
  id: string;
  colorKey: string;
  completedToday: boolean;
}

interface Props {
  habits: HabitLite[];
  streak: number;
  level: number;
}

const PETAL_D = "M100 92 C82 72 84 40 100 16 C116 40 118 72 100 92 Z";

function statusText(done: number, due: number): { title: string; sub: string } {
  if (due === 0) return { title: "لا عادات اليوم", sub: "استرِح — وغداً نبدأ برفق." };
  if (done >= due) return { title: "اكتمل يومك", sub: "أحسنت، تفتّحت زهرتك." };
  const left = due - done;
  const leftText = left === 1 ? "عادةٌ واحدة" : left === 2 ? "عادتان" : `${ar(left)} عادات`;
  return {
    title: done === 0 ? "لنبدأ يومك برفق" : "أنت في الطريق",
    sub: `بقيت ${leftText} على اكتماله.`,
  };
}

export default function BloomHero({ habits, streak, level }: Props) {
  const due = habits.length;
  const done = habits.filter((h) => h.completedToday).length;
  const allDone = due > 0 && done >= due;
  const { title, sub } = statusText(done, due);
  const n = Math.max(due, 1);

  return (
    <div
      className="relative mt-3 flex items-center gap-3.5 overflow-hidden rounded-[--radius-xl] border border-[--color-hairline-soft] p-3.5"
      style={{
        background: "linear-gradient(180deg, var(--color-surface), var(--color-bg))",
        boxShadow: "var(--shadow-top), var(--shadow-1)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-8 right-0 h-32 w-32 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(224,145,58,0.10), transparent 70%)" }}
      />

      {/* زهرة اليوم — بتلةٌ لكل عادة، تتفتّح بلونها عند إنجازها */}
      <div
        className={`relative grid h-[92px] w-[92px] shrink-0 place-items-center ${allDone ? "animate-breathe" : ""}`}
      >
        <svg width="92" height="92" viewBox="0 0 200 200" aria-hidden>
          {due === 0 && <circle cx="100" cy="100" r="18" fill="var(--color-surface-3)" />}
          {habits.map((h, i) => {
            const accent = accentOf(h.colorKey);
            const soft = accentSoftOf(h.colorKey);
            const dn = h.completedToday;
            return (
              <g key={h.id} transform={`rotate(${(i * 360) / n} 100 100)`}>
                <path
                  d={PETAL_D}
                  style={{
                    fill: dn ? accent : soft,
                    stroke: dn ? "var(--color-surface)" : accent,
                    strokeWidth: dn ? 1.5 : 1.4,
                    strokeOpacity: dn ? 0.9 : 0.45,
                    opacity: dn ? 0.96 : 0.5,
                    transformBox: "fill-box",
                    transformOrigin: "center bottom",
                    transform: dn ? "scale(1)" : "scale(0.78)",
                    transition:
                      "transform .55s var(--ease-spring), opacity .4s ease, fill .4s ease, stroke .4s ease",
                  }}
                />
              </g>
            );
          })}
          {/* قلبٌ ذهبيّ */}
          <circle cx="100" cy="100" r="15" fill="var(--color-surface)" />
          <circle cx="100" cy="100" r="9.5" fill="var(--color-accent)" />
        </svg>
      </div>

      {/* النص + الرقاقات */}
      <div className="min-w-0 flex-1">
        <h2 className="font-[family-name:var(--font-display)] text-sm font-bold leading-snug text-[--color-ink]">
          {title}
        </h2>
        <p className="mt-0.5 text-xs leading-relaxed text-[--color-muted]">{sub}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2.5 py-1 text-xs font-semibold text-[--color-muted]">
            <span className="score text-[--color-ink]">
              {ar(done)} / {ar(due)}
            </span>
            اليوم
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2.5 py-1 text-xs font-semibold text-[--color-muted]">
            <Icon name="leaf" size={13} className="text-[--color-sage]" />
            <span className="streak text-[--color-ink]">{ar(streak)}</span> مداومة
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2.5 py-1 text-xs font-semibold text-[--color-muted]">
            <Icon name="spark" size={13} className="text-[--color-accent]" />
            مستوى <span className="tabular text-[--color-ink]">{ar(level)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
