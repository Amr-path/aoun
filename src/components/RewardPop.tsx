"use client";
// عون — نافذة المكافأة المبهجة عند إتمام عادة (نقاط + اقتباس + قصاصات).
// احتفاءٌ أرقى عند المحطات (7/30/100/365 يوماً).
import { useEffect } from "react";
import { useDashboard } from "@/store/dashboard";
import { accentOf, accentInkOf, accentSoftOf } from "@/lib/colors";
import { ar } from "@/lib/numerals";

function confettiRing(n: number, radius: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { dx: Math.cos(a) * radius, dy: Math.sin(a) * radius, rot: (i % 2 ? 1 : -1) * 220 };
  });
}

export default function RewardPop() {
  const reward = useDashboard((s) => s.reward);
  const clear = useDashboard((s) => s.clearReward);

  useEffect(() => {
    if (!reward) return;
    const t = window.setTimeout(clear, reward.milestone ? 3400 : 2400);
    return () => window.clearTimeout(t);
  }, [reward, clear]);

  if (!reward) return null;
  const accent = accentOf(reward.colorKey);
  const ink = accentInkOf(reward.colorKey);
  const soft = accentSoftOf(reward.colorKey);
  const pieces = confettiRing(reward.milestone ? 22 : 10, reward.milestone ? 62 : 44);

  return (
    <div
      key={reward.id}
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 mx-auto flex w-fit max-w-[90vw] justify-center px-4"
      role="status"
    >
      <div
        className="animate-cheer relative flex items-center gap-3 rounded-[--radius-card] border px-5 py-3"
        style={{
          background: "var(--color-surface)",
          borderColor: reward.milestone ? accent : "var(--color-border)",
          boxShadow: "0 18px 44px -18px rgba(46,46,43,0.30)",
        }}
      >
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute start-6 top-1/2 h-2 w-2 rounded-[2px]"
            style={
              {
                background: i % 3 === 0 ? "var(--color-amber)" : i % 3 === 1 ? accent : "var(--color-blush)",
                ["--dx" as string]: `${p.dx}px`,
                ["--dy" as string]: `${p.dy}px`,
                ["--rot" as string]: `${p.rot}deg`,
                animation: `confetti ${reward.milestone ? "0.9s" : "0.7s"} var(--ease-soft) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        <span
          className="grid h-11 w-11 place-items-center rounded-full text-lg font-black"
          style={{ background: soft, color: ink }}
        >
          {reward.milestone ? "✦" : `+${ar(reward.xp)}`}
        </span>
        <div className="flex flex-col">
          <span className="text-xs text-[--color-faint]">
            {reward.milestone ? "محطّة مداومة" : "نقطة خبرة"}
          </span>
          <span className="text-sm font-medium text-[--color-ink]">{reward.quote}</span>
        </div>
      </div>
    </div>
  );
}
