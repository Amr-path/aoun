"use client";
// عون — «زهرة اليوم» مُصغّرة وهادئة: حلقة تقدّم + كسر + رقاقتا المداومة والمستوى.
import { ar } from "@/lib/numerals";
import Icon from "./ui/Icon";

interface Props {
  done: number;
  due: number;
  streak: number;
  level: number;
}

const R = 33;
const C = 2 * Math.PI * R;

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

export default function BloomHero({ done, due, streak, level }: Props) {
  const ratio = due > 0 ? Math.min(done / due, 1) : 0;
  const allDone = due > 0 && done >= due;
  const { title, sub } = statusText(done, due);

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

      {/* الحلقة + الكسر */}
      <div
        className={`relative grid h-[84px] w-[84px] shrink-0 place-items-center ${allDone ? "animate-breathe" : ""}`}
      >
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
          <defs>
            <linearGradient id="aoun-sunrise" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2c06e" />
              <stop offset="0.55" stopColor="#e19a45" />
              <stop offset="1" stopColor="#cf813f" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="42" r={R} fill="none" stroke="var(--color-surface-2)" strokeWidth="8" />
          <circle
            cx="42"
            cy="42"
            r={R}
            fill="none"
            stroke="url(#aoun-sunrise)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - ratio)}
            transform="rotate(-90 42 42)"
            style={{ transition: "stroke-dashoffset .7s var(--ease-soft)" }}
          />
        </svg>
        <span className="absolute flex flex-col items-center">
          <b className="score font-[family-name:var(--font-display)] text-[19px] font-extrabold leading-none text-[--color-ink]">
            {ar(done)} / {ar(due)}
          </b>
          <span className="mt-0.5 text-[10px] text-[--color-muted]">اليوم</span>
        </span>
      </div>

      {/* النص + الرقاقات */}
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-display)] text-[14.5px] font-bold leading-snug text-[--color-ink]">
          {title}
        </p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-[--color-muted]">{sub}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2.5 py-1 text-[12px] font-semibold text-[--color-muted]">
            <Icon name="leaf" size={13} className="text-[--color-sage]" />
            <span className="streak text-[--color-ink]">{ar(streak)}</span> مداومة
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2.5 py-1 text-[12px] font-semibold text-[--color-muted]">
            <Icon name="spark" size={13} className="text-[--color-accent]" />
            مستوى <span className="tabular text-[--color-ink]">{ar(level)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
