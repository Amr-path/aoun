"use client";
// عون — «زهرة اليوم»: هيروٌ واحد يجمع حلقة التقدّم + البُرعم الحيّ + الكسر + رقاقات المداومة والمستوى.
import { useState } from "react";
import { ar } from "@/lib/numerals";
import Icon from "./ui/Icon";

interface Props {
  done: number;
  due: number;
  streak: number;
  level: number;
}

const R = 46;
const C = 2 * Math.PI * R;

function statusText(done: number, due: number): { title: string; sub: string } {
  if (due === 0)
    return { title: "لا عادات مستحقّة اليوم", sub: "خذ نفَساً — وغداً تُزهر من جديد." };
  if (done >= due)
    return { title: "اكتمل يومك — أحسنت", sub: "تفتّحت زهرةُ اليوم كاملةً." };
  const left = due - done;
  const leftText = left === 1 ? "عادةٌ واحدة" : left === 2 ? "عادتان" : `${ar(left)} عادات`;
  return {
    title: done === 0 ? "لنبدأ يومك برفق" : "أنت في الطريق",
    sub: `بقيت ${leftText} لتكتمل زهرةُ اليوم.`,
  };
}

export default function BloomHero({ done, due, streak, level }: Props) {
  const ratio = due > 0 ? Math.min(done / due, 1) : 0;
  const allDone = due > 0 && done >= due;
  const [wiggle, setWiggle] = useState(false);
  const scale = 0.55 + ratio * 0.45;
  const { title, sub } = statusText(done, due);

  const poke = () => {
    setWiggle(true);
    window.setTimeout(() => setWiggle(false), 450);
  };

  return (
    <div
      className="relative mt-4 flex items-center gap-4 overflow-hidden rounded-[--radius-xl] border border-[--color-hairline-soft] p-4"
      style={{
        background: "linear-gradient(180deg, var(--color-surface), var(--color-bg))",
        boxShadow: "var(--shadow-top), var(--shadow-1)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-10 right-0 h-44 w-44 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(224,145,58,0.15), transparent 68%)" }}
      />

      {/* الحلقة + البُرعم */}
      <button
        type="button"
        onClick={poke}
        aria-label="زهرة اليوم"
        className={`relative grid h-28 w-28 shrink-0 place-items-center ${allDone ? "animate-breathe" : ""}`}
      >
        <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden>
          <defs>
            <linearGradient id="aoun-sunrise" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0b75c" />
              <stop offset="0.55" stopColor="#e0913a" />
              <stop offset="1" stopColor="#d06e3c" />
            </linearGradient>
          </defs>
          <circle cx="56" cy="56" r={R} fill="none" stroke="var(--color-surface-2)" strokeWidth="9" />
          <circle
            cx="56"
            cy="56"
            r={R}
            fill="none"
            stroke="url(#aoun-sunrise)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - ratio)}
            transform="rotate(-90 56 56)"
            style={{ transition: "stroke-dashoffset .7s var(--ease-soft)" }}
          />
        </svg>

        <span className={`absolute flex flex-col items-center ${wiggle ? "animate-wiggle" : ""}`}>
          <svg
            width="26"
            height="24"
            viewBox="0 0 34 30"
            fill="none"
            aria-hidden
            style={{
              transformOrigin: "17px 29px",
              transform: `scale(${scale})`,
              transition: "transform .6s var(--ease-spring)",
            }}
          >
            <path d="M17 29 V15" stroke="var(--color-sage)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M17 18 C10 17 6 12 6 8 C12 8 16 12 17 18Z" fill="#7fb588" />
            <path d="M17 15 C24 14 28 9 28 5 C22 5 18 9 17 15Z" fill="var(--color-sage)" />
            {allDone ? (
              <circle cx="17" cy="9" r="3.6" fill="var(--color-accent)" />
            ) : (
              <circle cx="17" cy="10" r="2.4" fill="var(--color-accent)" opacity="0.85" />
            )}
          </svg>
          <b className="score font-[family-name:var(--font-display)] text-[22px] font-extrabold leading-none text-[--color-ink]">
            {ar(done)} / {ar(due)}
          </b>
          <span className="mt-0.5 text-[11px] text-[--color-muted]">اليوم</span>
        </span>
      </button>

      {/* النص + الرقاقات */}
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-display)] text-[15px] font-bold leading-snug text-[--color-ink]">
          {title}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[--color-muted]">{sub}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-3 py-1.5 text-[12.5px] font-semibold text-[--color-ink] shadow-[var(--shadow-top)]">
            <Icon name="leaf" size={14} className="text-[--color-sage]" />
            <span className="streak">{ar(streak)}</span> مداومة
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-3 py-1.5 text-[12.5px] font-semibold text-[--color-ink] shadow-[var(--shadow-top)]">
            <Icon name="spark" size={14} className="text-[--color-accent]" />
            مستوى <span className="tabular">{ar(level)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
