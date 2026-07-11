"use client";
// عون — مراجعة العادات المقترحة: إزالة، وإضافة عادة مخصّصة عبر طبقة التنقيح.
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import type { OnboardingHabitInput } from "@/lib/habits";
import { accentOf, accentSoftOf } from "@/lib/colors";

export interface DraftHabit extends OnboardingHabitInput {
  uid: string;
  /** للعرض فقط (لا يُرسل للخادم). */
  identity?: string;
  note?: string;
  why?: string;
}

interface Props {
  habits: DraftHabit[];
  onRemove: (uid: string) => void;
  onAddCustom: (text: string) => Promise<void>;
  onFinish: () => Promise<void>;
  finishing: boolean;
}

export default function ReviewStep({
  habits,
  onRemove,
  onAddCustom,
  onFinish,
  finishing,
}: Props) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const full = habits.length >= BRAND.maxHabits;

  const submitCustom = async () => {
    const t = text.trim();
    if (!t || full || adding) return;
    setAdding(true);
    try {
      await onAddCustom(t);
      setText("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="animate-rise flex flex-col">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
        عاداتك السبع
      </h2>
      <p className="mt-2 text-[--color-muted]">
        اخترناها لك بعنايةٍ من إجاباتك. عدّلها كما تشاء — {habits.length}/
        {BRAND.maxHabits}.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        {habits.map((h) => (
          <div key={h.uid} className="card flex items-center gap-3 p-3.5">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl"
              style={{ background: accentSoftOf(h.colorKey) }}
            >
              {h.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-[--color-ink]">{h.title}</h3>
                {h.apiRefined && (
                  <span
                    className="pill px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: "var(--color-lavender-soft)", color: "var(--color-lavender-ink)" }}
                  >
                    منقّحة
                  </span>
                )}
              </div>
              {h.identity && (
                <p className="mt-0.5 text-xs text-[--color-muted]">{h.identity}</p>
              )}
              {h.why && (
                <p className="mt-0.5 text-[11px] italic text-[--color-faint]">{h.why}</p>
              )}
              <p className="tabular mt-0.5 text-xs text-[--color-faint]">
                {h.scheduledAt} · {h.frequency === "daily" ? "يومي" : "أيام محدّدة"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(h.uid)}
              aria-label={`إزالة ${h.title}`}
              className="grid h-8 w-8 place-items-center rounded-full text-[--color-faint] transition-colors hover:bg-[--color-surface-2] hover:text-[--color-clay-ink]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {!full && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCustom()}
              placeholder="اكتب عادتك بكلماتك… مثال: أشرب ماءً أكثر"
              className="flex-1 rounded-2xl border border-[--color-hairline] bg-[--color-surface] px-4 py-3 text-[--color-ink] shadow-sm outline-none placeholder:text-[--color-faint] focus:border-[--color-sage]"
            />
            <button
              type="button"
              onClick={submitCustom}
              disabled={adding || !text.trim()}
              className="pill shrink-0 bg-[--color-surface-2] px-5 font-semibold text-[--color-ink] transition-colors hover:bg-[--color-surface-3] disabled:opacity-50"
            >
              {adding ? "…يُنقّح" : "إضافة"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-[--color-faint]">
            سيحوّلها عون إلى عادةٍ قابلة للتنفيذ بخطواتٍ وأوقاتٍ مقترحة.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onFinish}
        disabled={finishing || habits.length === 0}
        className="pill mt-8 py-3.5 text-center font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
        style={{ background: "var(--color-sage)" }}
      >
        {finishing ? "…نجهّز لوحتك" : "ابدأ رحلتي"}
      </button>
    </div>
  );
}
