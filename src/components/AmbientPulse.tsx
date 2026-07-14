"use client";
// عون — هالةٌ لونية لطيفة تنبض عبر الشاشة لحظة إتمام عادة (تجاوبٌ مع الإنجاز).
import { useEffect, useState } from "react";
import { useDashboard } from "@/store/dashboard";
import { accentOf } from "@/lib/colors";

export default function AmbientPulse() {
  const reward = useDashboard((s) => s.reward);
  const [pulse, setPulse] = useState<{ id: number; color: string } | null>(null);

  useEffect(() => {
    if (!reward) return;
    // وميض الشاشة الكامل للإنجازات الكبرى فقط (محطّة أو إكمال اليوم) — لا لكل إتمام،
    // فالهالة المحلّية في البطاقة + قصاصات المكافأة تكفيان للاحتفاء اليوميّ.
    const dayComplete = useDashboard.getState().score.currentScore >= 100;
    if (!reward.milestone && !dayComplete) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPulse({ id: reward.id, color: accentOf(reward.colorKey) });
    const t = window.setTimeout(() => setPulse(null), 950);
    return () => window.clearTimeout(t);
  }, [reward]);

  if (!pulse) return null;
  return (
    <div
      key={pulse.id}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(48rem 36rem at 50% 38%, ${pulse.color}, transparent 62%)`,
        animation: "halo-pulse 0.9s var(--ease-soft) forwards",
      }}
    />
  );
}
