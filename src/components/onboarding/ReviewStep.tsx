"use client";
// عون — مراجعة العادات المقترحة: إزالة، وإضافة عادة مخصّصة عبر طبقة التنقيح.
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import type { OnboardingHabitInput } from "@/lib/habits";
import { accentOf, accentSoftOf, accentInkOf } from "@/lib/colors";
import Icon from "@/components/ui/Icon";

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
      <p className="mt-3 text-[--color-muted]">
        اخترناها لك بعنايةٍ من إجاباتك. عدّلها كما تشاء — {habits.length}/
        {BRAND.maxHabits}.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {habits.map((h) => (
          <div key={h.uid} className="card flex items-center gap-3.5 p-4">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-[--radius-md] text-2xl"
              style={{
                background: accentSoftOf(h.colorKey),
                boxShadow: `inset 0 0 0 1px ${accentOf(h.colorKey)}22`,
              }}
            >
              {h.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-[--color-ink]">{h.title}</h3>
                {h.apiRefined && (
                  <span
                    className="pill inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-ink)" }}
                  >
                    <Icon name="spark" size={10} strokeWidth={2} />
                    منقّحة
                  </span>
                )}
              </div>
              {h.identity && (
                <p className="mt-0.5 text-xs" style={{ color: accentInkOf(h.colorKey) }}>{h.identity}</p>
              )}
              {h.why && (
                <p className="mt-0.5 text-[11px] italic text-[--color-faint]">{h.why}</p>
              )}
              <p className="tabular mt-1 flex items-center gap-1.5 text-xs text-[--color-faint]">
                <Icon name="clock" size={13} className="text-[--color-faint]" />
                {h.scheduledAt} · {h.frequency === "daily" ? "يومي" : "أيام محدّدة"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(h.uid)}
              aria-label={`إزالة ${h.title}`}
              className="press grid h-8 w-8 shrink-0 place-items-center rounded-full text-[--color-faint] transition-colors hover:bg-[--color-danger-soft] hover:text-[--color-danger-ink]"
            >
              <Icon name="close" size={16} />
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
              className="flex-1 rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-4 py-3 text-[--color-ink] shadow-[var(--shadow-1)] outline-none transition-colors placeholder:text-[--color-faint] focus:border-[--color-accent]"
            />
            <button
              type="button"
              onClick={submitCustom}
              disabled={adding || !text.trim()}
              className="press inline-flex shrink-0 items-center gap-1.5 rounded-[--radius-pill] px-5 font-semibold transition-colors disabled:opacity-50"
              style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-ink)" }}
            >
              {adding ? (
                "…يُنقّح"
              ) : (
                <>
                  <Icon name="plus" size={16} strokeWidth={2.2} />
                  إضافة
                </>
              )}
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
        className="press mt-8 flex items-center justify-center gap-2 rounded-[--radius-pill] bg-[--color-ink] py-4 text-center font-bold text-[--color-cream] shadow-[var(--shadow-2)] disabled:opacity-50"
      >
        {finishing ? (
          "…نجهّز لوحتك"
        ) : (
          <>
            <Icon name="leaf" size={18} className="text-[--color-cream]" />
            ابدأ رحلتي
          </>
        )}
      </button>
    </div>
  );
}
